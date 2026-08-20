export function getCookie(name: string): string | null {
  console.log("name: ", name)
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}