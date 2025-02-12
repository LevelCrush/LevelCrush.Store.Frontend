import { twMerge } from "tailwind-merge";
import Container from "./container";

export default function ContainerInner(
  props: React.PropsWithChildren<{ className?: string }>
) {
  return (
    <Container
      className={twMerge(
        "max-w-[80rem] mx-auto mt-8 mb-16 px-4",
        props.className || ""
      )}
      minimalCSS={true}
    >
      {props.children}
    </Container>
  );
}
