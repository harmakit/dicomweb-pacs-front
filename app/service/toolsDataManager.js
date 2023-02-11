import config from '../params';
import request from '../utils/request';

class ToolsDataManager {
  load(instanceUID) {
    const url = `${config.backendUrl}/api/instance/${instanceUID}/tools`;
    return request(url, {
      method: 'GET',
    });
  }

  update(instanceUID, toolsData) {
    const url = `${config.backendUrl}/api/instance/${instanceUID}/tools`;
    return request(url, {
      method: 'PUT',
      body: JSON.stringify(toolsData),
    });
  }
}

const toolsDataManager = new ToolsDataManager();
export default toolsDataManager;
