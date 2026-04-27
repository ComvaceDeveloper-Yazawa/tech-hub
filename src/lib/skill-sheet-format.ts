export function formatExperienceMonths(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years}年${months}か月`;
}

export function calculateAgeFromDate(birthDate: Date | null) {
  if (!birthDate) return '';

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return String(age);
}

export function formatReiwaDate(date: Date) {
  const year = date.getFullYear();
  const reiwaYear = year - 2018;
  const displayYear = reiwaYear === 1 ? '元' : String(reiwaYear);

  return `令和${displayYear}年${date.getMonth() + 1}月${date.getDate()}日`;
}
