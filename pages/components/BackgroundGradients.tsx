import { css, cx } from "@emotion/css";
import { useRecoilState } from "recoil";
import { canvasBgGradientStore } from "../../stores/stores";
import { getGradientConfig } from "../../utils/utils";
import { gradients } from "../../utils/gradients";
import { Gradient, GradientConfig } from "../../utils/interfaces";

const BackgroundGradients = () => {
  const [gradient, setGradient] = useRecoilState<Gradient>(
    canvasBgGradientStore
  );
  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-5 px-4 pb-4 gap-4 h-full border-b border-gray-700">
        {gradients.map((curGradient, index) => (
          <div
            key={index}
            tabIndex={0}
            role="button"
            onClick={() => setGradient(curGradient)}
            className={cx(
              "p-5 hover:ring hover:ring-gray-300 rounded-full cursor-pointer bg-white",
              {
                "ring ring-cyan-500":
                  curGradient.cssString === gradient.cssString,
              },
              css`
                background: ${curGradient.cssString};
              `
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundGradients;
