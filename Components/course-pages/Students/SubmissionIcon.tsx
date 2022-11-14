import { HiCheckCircle, HiClock, HiExclamation, HiEye } from "react-icons/hi";
import { AlertType } from "../../../types";
import Tippy from "@tippyjs/react";

type SubmissionIconProps = {
  alertType?: AlertType;
  count: number;
};

const SubmissionIcon = ({ alertType, count }: SubmissionIconProps) => {
  if (alertType == null)
    return (
      <Tippy content="No warnings">
        <div className="text-green-500">
          <HiCheckCircle />
        </div>
      </Tippy>
    );

  if (count === 0) return <></>;

  switch (alertType) {
    case AlertType.ERROR:
      return (
        <Tippy content={`${count} error${count !== 1 ? "s" : ""}`}>
          <div className="flex items-center text-orange-500">
            {count} <HiExclamation />
          </div>
        </Tippy>
      );
    case AlertType.MISSING:
      return (
        <Tippy content={`${count} missing`}>
          <div className="flex items-center text-yellow-500">
            {count} <HiClock />
          </div>
        </Tippy>
      );
    case AlertType.PLAGIARISM:
      return (
        <Tippy content={`${count} plagiarism flag${count !== 1 ? "s" : ""}`}>
          <div className="flex items-center text-red-500">
            {count} <HiEye />
          </div>
        </Tippy>
      );
  }
};

export default SubmissionIcon;
