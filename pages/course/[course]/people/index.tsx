import { Alerts, AlertType, User } from "types";
import SubmissionIcon from "Components/SubmissionIcon";
import { GetServerSidePropsContext, NextPage } from "next";
import withProtected from "util/withProtected";
import { getCurrentUser, queryParamToNumber } from "util/misc";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import AddUserModal from "Components/AddUserModal";
import { useState } from "react";
import RemoveUserModal from "Components/RemoveUserModal";
import Button from "Components/Button";
import { HiEye, HiPencil, HiPlus, HiX } from "react-icons/hi";
import PanelLink from "Components/PanelLink";
import { useRouter } from "next/router";
import EditUserRoleModal from "Components/EditUserRoleModal";

type UserWithMembership = User & { membership: { id: number; role: "STUDENT" | "INSTRUCTOR" }[] };
interface StudentsProps {
  students: UserWithMembership[];
  section: {
    id: number;
    course: {
      id: number;
      department: string;
      number: string;
    };
    section_number: string;
  };
  isInstructor: boolean;
  allUsers: User[];
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const courseId = queryParamToNumber(ctx.query?.course);
    const supabase = createServerSupabaseClient(ctx);

    const { data: course } = await supabase
      .from("section")
      .select("id, section_number, course ( id, department, number )")
      .filter("id", "eq", courseId)
      .single();

    const currentUser = await getCurrentUser(supabase);
    const { data: currentUserMembership } = await supabase
      .from("membership")
      .select("role")
      .eq("section", courseId)
      .eq("user", currentUser?.id)
      .single();

    if (!currentUserMembership) {
      return {
        redirect: {
          destination: "/course",
          permanent: false,
        },
      };
    }

    const isInstructor = currentUserMembership.role === "INSTRUCTOR";

    const students = await supabase
      .from("user")
      .select("id, given_name, family_name, euid, section ( id ), membership ( id, role ), submission (id, score)")
      .eq("section.id", courseId)
      .eq("membership.section", courseId)
      .order("family_name, given_name")
      .then(({ data, error }) => {
        if (error) console.error(error);
        return data?.map((d) => {
          if (isInstructor)
            return {
              ...d,
              name: d.given_name + " " + d.family_name,
              submissionCount: Array.isArray(d.submission) ? d.submission.length : d.submission ? 1 : 0,
              alerts: {
                errors: 0,
                plagiarism: 0,
                missing: 0,
              },
              grade: Array.isArray(d.submission)
                ? d.submission.reduce<number>((prev, { score }, idx) => {
                    if (Array.isArray(d.submission) && idx === d.submission.length - 1) {
                      return (prev + score) / d.submission.length;
                    }
                    return prev + score;
                  }, 0)
                : 0,
              canCreateClass: false,
              auth_id: "",
            } as User;

          return {
            ...d,
            name: d.given_name + " " + d.family_name,
            submissionCount: -1,
            alerts: {
              errors: -1,
              plagiarism: -1,
              missing: -1,
            },
            grade: -1,
            canCreateClass: false,
            role: Array.isArray(d.membership)
              ? d.membership.some(({ role }) => role === "INSTRUCTOR")
                ? "INSTRUCTOR"
                : "STUDENT"
              : d.membership?.role ?? "STUDENT",
          };
        });
      });

    const allUsers = await supabase
      .from("user")
      .select("id, given_name, family_name, euid, membership ( section )")
      .then(({ data: users }) => users?.map((u) => ({ ...u, name: `${u.given_name} ${u.family_name}` })));

    console.log({ course });

    return {
      props: {
        students,
        section: course,
        isInstructor,
        allUsers: allUsers?.filter((user) => {
          if (user) {
            if (Array.isArray(user.membership)) {
              return user.membership.every(({ section }) => section !== courseId);
            } else if (user.membership) {
              return user.membership.section !== courseId;
            }
            return true;
          }
        }),
      },
    };
  });

const Warnings = ({ Alerts }: { Alerts: Alerts }) => {
  const { missing: Missing, plagiarism: Plagarism, errors: Errors } = Alerts;

  if (Missing == 0 && Plagarism == 0 && Errors == 0) {
    return <SubmissionIcon count={0} />;
  }

  return (
    <div className="text-lg flex gap-1">
      <SubmissionIcon alertType={AlertType.MISSING} count={Alerts.missing} />
      <SubmissionIcon alertType={AlertType.ERROR} count={Alerts.errors} />
      <SubmissionIcon alertType={AlertType.PLAGIARISM} count={Alerts.plagiarism} />
    </div>
  );
};

const UserBlock: React.FC<{
  user: User & { membership: { id: number; role: "STUDENT" | "INSTRUCTOR" }[] };
  isInstructor: boolean;
  openDeleteModal: (u: User) => void;
  openEditModal: (u: UserWithMembership) => void;
}> = ({ user, isInstructor, openDeleteModal, openEditModal }) => {
  const showStudentDetails = isInstructor && user.membership.some(({ role }) => role === "STUDENT");

  const router = useRouter();

  const hasName = user.name !== " ";

  return (
    <div className="bg-gray-800/25 border border-gray-400 w-full p-3 rounded-md">
      <div className="flex justify-between flex-wrap-reverse">
        <div>
          <div className="flex flex-col gap-4">
            <div className="">
              <div className="text-xl flex gap-2 items-center">
                <h3 className="text-xl font-bold">{hasName ? user.name : user.euid}</h3>
                <div>{showStudentDetails && <Warnings Alerts={user.alerts} />}</div>
              </div>
              {hasName && <p className="text-sm font-mono">{user.euid}</p>}
            </div>
          </div>
          {showStudentDetails && <p className="mt-2 text-sm">{user.submissionCount} submissions</p>}
          {showStudentDetails && <p className="mt-2 text-sm">Current Grade: {parseFloat(user.grade.toFixed(2))}%</p>}
        </div>
        <div className="text-gray-400 mb-2 w-full sm:w-auto">
          <ul className="flex rounded-md border border-gray-400 shadow-xl w-min mx-auto">
            <PanelLink title="View" position={isInstructor ? "first" : "only"} href={`${router.asPath}/${user.id}`}>
              <HiEye />
            </PanelLink>

            {isInstructor && (
              <>
                <PanelLink title="Edit" position="other" onClick={() => openEditModal(user)}>
                  <HiPencil />
                </PanelLink>
                <PanelLink title="Delete" position="last" onClick={() => openDeleteModal(user)}>
                  <HiX className="text-red-500" />
                </PanelLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const People: NextPage<StudentsProps> = ({ students: people, section, isInstructor, allUsers }) => {
  console.log(people);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User>();
  const [userToEdit, setUserToEdit] = useState<UserWithMembership>();

  const router = useRouter();

  const createUserAssignment = async (userId: number) => {
    await fetch(`/api/assignStudent`, {
      method: "POST",
      body: JSON.stringify({
        sectionId: section.id,
        userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => {
      if (r.ok) {
        router.replace(router.asPath); // reload server side props to update page state
      }
    });
  };

  const removeUser = async (userId: number) => {
    await fetch("/api/removeUserAssignment", {
      method: "POST",
      body: JSON.stringify({
        sectionId: section.id,
        userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => {
      if (r.ok) {
        router.replace(router.asPath);
      }
    });
  };

  const updateUserRole = async (user: User, role: "STUDENT" | "INSTRUCTOR") => {
    console.log(`Updating user role! User: ${user.euid}, role: ${role}`);
    await fetch("/api/updateUserRole", {
      method: "POST",
      body: JSON.stringify({
        sectionId: section.id,
        userId: user.id,
        role,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => {
      if (r.ok) {
        router.replace(router.asPath);
      }
    });
  };

  const openDeleteModal = (user: User) => {
    setUserToRemove(user);
    setRemoveModalOpen(true);
  };

  const openEditModal = (user: UserWithMembership) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  return (
    <div className="flex mb-24">
      {isInstructor && (
        <>
          <AddUserModal
            users={allUsers}
            open={addModalOpen}
            setOpen={setAddModalOpen}
            assignUser={createUserAssignment}
          />
          <RemoveUserModal
            user={userToRemove}
            open={removeModalOpen}
            setOpen={setRemoveModalOpen}
            removeUser={removeUser}
          />
          <EditUserRoleModal
            user={userToEdit}
            open={editModalOpen}
            role={userToEdit?.membership.some(({ role }) => role === "INSTRUCTOR") ? "INSTRUCTOR" : "STUDENT"}
            setOpen={setEditModalOpen}
            updateRole={updateUserRole}
          />
        </>
      )}
      <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 h-screen w-full">
        <h1 className="text-3xl font-bold">
          People - {section.course.department} {section.course.number}.{section.section_number}
        </h1>
        {isInstructor && (
          <Button onClick={() => setAddModalOpen(true)} className="flex-shrink-0 w-min whitespace-nowrap">
            <HiPlus /> Add new
          </Button>
        )}
        <h2 className="mt-6 text-xl font-semibold">Instructors</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {people
            .filter(({ membership }) => membership.some(({ role }) => role === "INSTRUCTOR"))
            .map((instructor, index) => {
              return (
                <UserBlock
                  user={instructor}
                  isInstructor={isInstructor}
                  key={index}
                  openDeleteModal={openDeleteModal}
                  openEditModal={openEditModal}
                />
              );
            })}
        </div>
        <h2 className="mt-6 text-xl font-semibold">Students</h2>

        <div className="grid md:grid-cols-2 gap-6 pb-16">
          {people
            .filter(({ membership }) => membership.some(({ role }) => role === "STUDENT"))
            .map((student, index) => {
              return (
                <UserBlock
                  user={student}
                  isInstructor={isInstructor}
                  key={index}
                  openDeleteModal={openDeleteModal}
                  openEditModal={openEditModal}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default People;
