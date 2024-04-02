import { PluginSlot } from '@openedx/frontend-plugin-framework';

function PluginSlotWithInsert() {
  return (
    <div className="border border-primary mb-2">
      <h2 className="pl-3">Plugin Operation: Insert</h2>
      <PluginSlot
        id="slot_with_insert_operation"
        data-testid="testing"
      >
        <section className="bg-success p-3 text-light">
          <h3>Default Content</h3>
          <p>
            This widget represents a component that is wrapped by the Plugin Slot.

            Note that this default widget appears after the Direct and iFrame plugins. This is because this component&apos;s
            &quot;priority&quot; is has a default set to 50. To change it, you could use the Plugin Operation "Modify",
            or set the priority of the plugins around it.
          </p>
        </section>
      </PluginSlot>
    </div>
  );
}

export default PluginSlotWithInsert;
