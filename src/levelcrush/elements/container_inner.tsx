import Container from "./container";

export default function ContainerInner(props: React.PropsWithChildren<{}>) { 
    return <Container
        className="max-w-[80rem] mx-auto mt-8 mb-16"
        minimalCSS={true}
    >{props.children}</Container>
}