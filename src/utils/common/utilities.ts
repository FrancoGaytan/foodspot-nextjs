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

export function getOnlyDate(evDateTime: Date) {
  return evDateTime.getDate().toString() + '. ' + (evDateTime.getMonth() + 1).toString() + '. ' + evDateTime.getFullYear().toString() + '.';
}

export function getOnlyHour(evDateTime: Date) {
  return (evDateTime.getHours() + 3).toString() + ':' + parseMinutes(evDateTime.getMinutes().toString());
}

export function gettingDateDiference(penalizationStartDate: Date): number {
		const startingDate = new Date(penalizationStartDate);
		const todayDate = new Date();

		const start = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate());
		const today = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

		if (today <= start) return 0;

		const diffInMilliseconds = today.getTime() - start.getTime();
		return diffInMilliseconds / (1000 * 60 * 60 * 24);
	}
