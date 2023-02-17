import { XCircleOutline } from "heroicons-react";
import { FC, LegacyRef, useMemo, useRef } from "react";
import { isMobile } from "react-device-detect";

export const PerformanceModal: FC = () => {
  const ref = useRef<HTMLInputElement>();

  useMemo(() => {
    setTimeout(() => {
      if (ref?.current?.checked) {
        ref.current.checked = false;
      }
    }, 12500);
  }, []);

  return (
    <>
      {isMobile && (
        <>
          <input
            id={"performance-modal"}
            ref={ref as LegacyRef<HTMLInputElement>}
            type="checkbox"
            className={"hidden modal-toggle"}
            defaultChecked
          />
          <div className={"modal"}>
            <div className="modal-box my-auto relative">
              <label
                htmlFor={"performance-modal"}
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                <XCircleOutline />
              </label>
              <h1 className="text-2xl font-bold text-center">
                On a mobile device?
              </h1>
              <p className="my-3">
                Please visit again on a computer for the full experience.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
