import '@cyntler/react-doc-viewer/dist/index.css';

export function parseMinutes(minutes: string) {
  let newMinutes = minutes;
  if (Number(minutes) < 10) {
    newMinutes = '0' + minutes;
  }
  return newMinutes;
}

interface DownloadFileParams {
  file: Blob | File;
  fileName: string;
}

export const downloadFile = ({ file, fileName }: DownloadFileParams): void => {
  const blob = new Blob([file], { type: file.type });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export function validatePassword(password: string): boolean {
  const expReg = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$');
  return expReg.test(password);
}
