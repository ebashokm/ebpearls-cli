const MODE = 'mix';
export const CloudRecordingEndpoints = Object.freeze({
  ACQUIRE: '/acquire',
  START: (resourceId: string) => `/resourceid/${resourceId}/mode/${MODE}/start`,
  STOP: (resourceId: string, sid: string) => `/resourceid/${resourceId}/sid/${sid}/mode/${MODE}/stop`,
  QUERY: (resourceId: string, sid: string) => `/resourceid/${resourceId}/sid/${sid}/mode/${MODE}/query`,
});
