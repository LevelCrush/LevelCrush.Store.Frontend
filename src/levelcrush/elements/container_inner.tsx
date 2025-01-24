import Container from "./container";

export default function ContainerInner(props: React.PropsWithChildren<{}>) { 
    return <Container
        className="max-w-[80rem]"
    >{props.children}</Container>
}