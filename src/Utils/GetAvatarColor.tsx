const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500"
];

export function getAvatarColor(name?: string) {
  if (!name) return "bg-gray-400";

  let hash = 0;

  // Loop on each letter from the assignee name
  for (let i = 0; i < name.length; i++) {
    // name.charCodeAt(i): Convert each letter to its ASCII, So A = 65
    // (hash << 5) = hash * 2^5 = hash * 32
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    //So, hash = current char + (hash * 32 - 1 = 31) this called string hashing
  }

  // Conver tha hash number to an invalid index number inside the colors array
  // hash % colors.length => ex. hash = 17, colors.length = 4 => 17 % 4 = 1, Take index 1
  // Math.abs to prevent negative numbers
  const index = Math.abs(hash % colors.length);
  return colors[index];
}
