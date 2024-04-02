export default function ModularComponent({ content = {} }: {content: { title?: string, uniqueText?: string }}) {
  return (
    <section className="bg-light p-3">
      <h3>{ content.title }</h3>
      <p>
        This is a modular component that lives in the example app.
      </p>
      <p>
        <em>{content.uniqueText}</em>
      </p>
    </section>
  );
}
