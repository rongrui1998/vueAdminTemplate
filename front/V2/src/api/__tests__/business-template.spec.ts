import { request } from '@/utils/request';
import {
  createBusinessTemplateApi,
  deleteBusinessTemplateApi,
  getBusinessTemplateDetailApi,
  getBusinessTemplatesApi,
  updateBusinessTemplateApi,
} from '@/api/business-template';

vi.mock('@/utils/request', () => ({
  request: vi.fn(),
}));

describe('business template api', () => {
  beforeEach(() => {
    vi.mocked(request).mockResolvedValue({});
  });

  it('sends business template CRUD requests to the backend contract', async () => {
    await getBusinessTemplatesApi({ keyword: '客户', status: 1 });
    expect(request).toHaveBeenLastCalledWith({
      url: '/demo/business-templates',
      method: 'get',
      params: {
        keyword: '客户',
        status: 1,
      },
    });

    await createBusinessTemplateApi({
      name: '合同模板维护',
      owner: '法务中台',
      scene: '合同管理',
      status: 1,
      remark: '接口创建',
    });
    expect(request).toHaveBeenLastCalledWith({
      url: '/demo/business-templates',
      method: 'post',
      data: {
        name: '合同模板维护',
        owner: '法务中台',
        scene: '合同管理',
        status: 1,
        remark: '接口创建',
      },
    });

    await getBusinessTemplateDetailApi('tpl-1');
    expect(request).toHaveBeenLastCalledWith({
      url: '/demo/business-templates/tpl-1',
      method: 'get',
    });

    await updateBusinessTemplateApi('tpl-1', {
      name: '合同配置维护',
      owner: '法务中台',
      scene: '合同管理',
      status: 0,
      remark: '已停用',
    });
    expect(request).toHaveBeenLastCalledWith({
      url: '/demo/business-templates/tpl-1',
      method: 'put',
      data: {
        name: '合同配置维护',
        owner: '法务中台',
        scene: '合同管理',
        status: 0,
        remark: '已停用',
      },
    });

    await deleteBusinessTemplateApi('tpl-1');
    expect(request).toHaveBeenLastCalledWith({
      url: '/demo/business-templates/tpl-1',
      method: 'delete',
    });
  });
});
