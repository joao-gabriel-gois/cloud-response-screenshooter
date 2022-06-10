export const getServiceName = (url) => {
  return (
    url.split('.')[1]
      ? url.split('.')[0] + '-' + url.split('.')[1]
      : url.split('.')[0]
  );
}
