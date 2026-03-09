import {
  type ChangeEventHandler,
  type DetailedHTMLProps,
  forwardRef,
  type TextareaHTMLAttributes,
  useCallback,
} from "react";

type IProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  autoResize?: boolean;
};

const TextArea = forwardRef(
  (
    { autoResize, onChange, className, ...rest }: IProps,
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
      (e) => {
        onChange?.(e);
        if (!autoResize) return;
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
      },
      [onChange, autoResize]
    );

    return (
      <textarea
        {...rest}
        className={"fr-input" + (className ?? "")}
        onChange={handleChange}
        ref={ref}
        style={{
          resize: autoResize ? "none" : "vertical",
          overflow: autoResize ? "hidden" : "auto",
        }}
      />
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
