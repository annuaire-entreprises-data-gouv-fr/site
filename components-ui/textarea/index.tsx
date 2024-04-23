import {
  ChangeEventHandler,
  DetailedHTMLProps,
  TextareaHTMLAttributes,
  forwardRef,
  useCallback,
} from 'react';

type IProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  autoResize?: boolean;
};

function TextArea(
  { autoResize, onChange, className, ...rest }: IProps,
  ref: React.Ref<HTMLTextAreaElement>
) {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      onChange?.(e);
      if (!autoResize) return;
      e.target.style.height = 'inherit';
      e.target.style.height = `${e.target.scrollHeight}px`;
    },
    [onChange, autoResize]
  );

  return (
    <textarea
      {...rest}
      style={{
        resize: autoResize ? 'none' : 'vertical',
        overflow: autoResize ? 'hidden' : 'auto',
      }}
      ref={ref}
      className={'fr-input ' + (className ?? '')}
      onChange={handleChange}
    />
  );
}

export default forwardRef(TextArea);
