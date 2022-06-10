import { dirname as getAbsPath} from 'path';
import { fileURLToPath as getUrl } from 'url';

export const getCurrentDirname = (callerUrl) => getAbsPath(getUrl(callerUrl));
