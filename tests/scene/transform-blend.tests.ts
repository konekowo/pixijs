import { Container } from '../../src/scene/container/Container';
import { updateLayerGroupTransforms } from '../../src/scene/container/utils/updateLayerGroupTransforms';

describe('Transform Blend Modes', () =>
{
    it('should not cause a rebuild if blend mode is changed on a layer', async () =>
    {
        const root = new Container({ isRenderGroup: true });

        root.renderGroup.structureDidChange = false;

        root.blendMode = 'add';

        expect(root.renderGroup.structureDidChange).toEqual(false);
    });

    it('should cause a rebuild if blend mode is changed on a child', async () =>
    {
        const root = new Container({ isRenderGroup: true });

        root.renderGroup.structureDidChange = false;

        const child = new Container();

        root.addChild(child);

        child.blendMode = 'add';

        expect(root.renderGroup.structureDidChange).toEqual(true);
    });

    it('should inherit blend modes on the scene graph', async () =>
    {
        const root = new Container({ isRenderGroup: true, label: 'root' });

        const container = new Container({ label: 'container' });

        const child = new Container({ label: 'child' });

        root.addChild(container);

        container.addChild(child);

        container.blendMode = 'add';

        updateLayerGroupTransforms(root.renderGroup, true);

        expect(child.rgBlendMode).toEqual('add');
    });

    it('should inherit blend modes when children swapped around on the scene graph', async () =>
    {
        const root = new Container({ isRenderGroup: true, label: 'root' });

        const container = new Container({ label: 'container' });
        const containerAdd = new Container({ label: 'containerAdd' });

        const child = new Container({ label: 'child' });

        root.addChild(container);
        root.addChild(containerAdd);

        container.addChild(child);

        containerAdd.blendMode = 'add';

        updateLayerGroupTransforms(root.renderGroup, true);

        expect(child.rgBlendMode).toEqual('normal');

        containerAdd.addChild(child);

        updateLayerGroupTransforms(root.renderGroup, true);

        expect(child.rgBlendMode).toEqual('add');
    });
});

// Test to cover
