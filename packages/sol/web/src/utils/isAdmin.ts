export function isAdmin() {
  const key = "asdfasd";
  if (!key) {
    throw new Error("ADMIN KEY KEY NOT SET???");
  }
  return localStorage.getItem("voxelverses-admin") === key;
}
