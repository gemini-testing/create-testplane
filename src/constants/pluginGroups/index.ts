import type { PluginGroup } from "../../types/toolOpts";
import browsersGroup from "./browsersGroup";
import miscGroup from "./miscGroup";
import reportsGroup from "./reportsGroup";
import stabilityGroup from "./stabilityGroup";

const pluginsGroup: PluginGroup[] = [reportsGroup, browsersGroup, stabilityGroup, miscGroup];

export default pluginsGroup;
