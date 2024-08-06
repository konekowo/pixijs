import type { InstructionSet } from '../../../rendering/renderers/shared/instructions/InstructionSet';
import type { Renderer } from '../../../rendering/renderers/types';
import type { Container } from '../Container';
import type { RenderGroup } from '../RenderGroup';
export declare function buildInstructions(renderGroup: RenderGroup, renderer: Renderer): void;
export declare function collectAllRenderables(container: Container, instructionSet: InstructionSet, renderer: Renderer): void;
