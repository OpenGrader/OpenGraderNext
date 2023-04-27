import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import Badge, { BadgeVariant } from "Components/Badge";
import withProtected from "../../../../../util/withProtected";
import { queryParamToNumber } from "../../../../../util/misc";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { User, Assignment } from "types";
import Button from "Components/Button";
import { supabaseAdmin } from "util/supabaseClient";
import CodeBrowser from "Components/CodeBrowser";
import Comments from "Components/Comments";
import {Comment} from 'Components/Comments';
import { useAppSelector } from "hooks";

type Submission = {
  id: string;
  is_late: boolean;
  score: number | null;
  flags: string[] | null;
  student: User;
  file: string;
};

type AssignmentT = Assignment & { submission: Submission[] };

interface AssignmentProps {
  id: number;
  courseId: number;
  assignment: AssignmentT;
  file: string;
  serverComments: Comment[];
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async () => {
    const assignmentId = queryParamToNumber(ctx.query?.assignment);
    const courseId = queryParamToNumber(ctx.query?.course);

    const supabase = createServerSupabaseClient(ctx);

    let blob;
    let code;
    blob = await supabaseAdmin.storage.from("assignments").download(`8/5_hw1.py`); //hardcoded; going to fix ASAP;

    if (blob?.data != null) {
      code = await blob.data.text();
    }

    const assignmentData = await supabase
      .from("assignment")
      .select(
        `
        id,
        title,
        description,
        is_open,
        is_late, 
        submission (
          id,
          is_late,
          score,
          flags,
          student (
            id,
            euid,
            given_name,
            family_name
          )
        )
        `,
      )
      .eq("id", assignmentId)
      .order("created_at", { foreignTable: "submission", ascending: false })
      .single();

    return {
      props: {
        id: assignmentId,
        courseId,
        assignment: assignmentData.data,
        file: code,
      },
    };
  });

const flagClass = (flag: string): BadgeVariant => {
  switch (flag) {
    case "ERROR":
      return "red";
    case "PLAGIARISM":
      return "orange";
    case "MISSING":
      return "pink";
    default:
      return "cyan";
  }
};

const SubmissionCard: React.FC<Submission & { file: string}> = ({id, is_late, score, flags, student, file}) => {
  const [isSubmissionCardClicked, setIsSubmissionCardClicked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const user = useAppSelector((store) => store.user)
  const handleSubmissionCardClick = () => {
    setIsSubmissionCardClicked((prevState) => !prevState);
  };
  const handleCommentSubmit = (lineNumber: number, lineContent: string, text: string) => {
    const newComment = {
      lineNumber: lineNumber,
      lineContent: lineContent,
      text: text,
      author: user.name,
    }
    setComments([...comments, newComment])
  }
  let studentDesc: string;
  if (student.given_name || student.family_name) {
    studentDesc = `${student.given_name} ${student.family_name}`;
  } else {
    studentDesc = student.euid;
  }

  return (
    <div>
      <div className="divide-y divide-gray-600 overflow-hidden rounded-lg bg-gray-800 shadow w-full">
        <div className="px-4 py-5 sm:px-6 text-xl flex items-center gap-2" onClick={handleSubmissionCardClick}>
          {studentDesc} {is_late && <Badge variant="red">Late</Badge>}
        </div>
        <div className="px-4 py-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-2" onClick={handleSubmissionCardClick}>
          <div>
            <div className="font-bold">Score</div>
            <div className="my-1">{score ? score : "Ungraded"}</div>
          </div>
          <div>
            <div className="font-bold">Flags</div>
            <div className="flex gap-2 flex-wrap my-1">
              {flags && flags.length > 0
                ? flags.map((flag) => <Badge variant={flagClass(flag)}>{flag}</Badge>)
                : "No flags"}
            </div>
          </div>
        </div>
        <div>{isSubmissionCardClicked && <CodeBrowser language="python" code={file} onCommentSubmit={handleCommentSubmit}/>}</div>
        <div>{isSubmissionCardClicked && <Comments comments={comments}></Comments>}</div>
      </div>
    </div>
  );
};

const AssignmentView: NextPage<AssignmentProps> = ({ assignment, file, courseId }) => {
  return (
    <div className="flex flex-wrap">
      <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <div className="grid gap-6">
          <div className="grid gap-6">
            <h1 className="font-bold text-3xl text-gray-50 flex flex-wrap items-center gap-4 w-full">
              Assignment: {assignment.title}{" "}
              {assignment.is_open ? (
                <>
                  <Badge variant="green">Open</Badge>
                  {assignment.is_late ? (
                    <Badge variant="orange">New submissions are late</Badge>
                  ) : (
                    <Badge variant="cyan">Ready for submissions</Badge>
                  )}
                </>
              ) : (
                <Badge variant="red">Locked</Badge>
              )}{" "}
            </h1>
            <p className="max-w-[80ch]">{assignment.description}</p>
          </div>

          <Button href={`/course/${courseId}/assignment/${assignment.id}/submit`} arrow="right" className="w-min">
            <h1>Submit</h1>
          </Button>
          <h2 className="font-semibold text-2xl text-gray-50">Submissions</h2>
        </div>
        {assignment.submission.map((submission) => {
              if (typeof submission.student === "number") {
                return null;
              }
              return (
                submission.student && (
                  <SubmissionCard
                    id={submission.id.toString()}
                    is_late={submission.is_late}
                    score={submission.score}
                    flags={submission.flags}
                    student={submission.student}
                    file={file}
                  />
                )
              );
            })}
        {assignment.submission.length === 0 && <em className="text-gray-300">No submissions yet.</em>}
      </div>
    </div>
  );
};

export default AssignmentView;
