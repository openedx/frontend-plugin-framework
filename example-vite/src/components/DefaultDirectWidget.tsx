export default function DefaultDirectWidget() {
  return (
    <section className="bg-success p-3 text-light">
      <h3>Default Direct Widget</h3>
      <p>
        This widget is a default component that lives in the example app and is directly inserted via JS configuration.
        Note that this default widget appears after the Inserted Direct Plugin. This is because this component&apos;s
        &quot;priority&quot; is set to 20 in the JS config.
      </p>
    </section>
  );
}
