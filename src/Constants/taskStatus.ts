export const TaskStatus = [
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE"
];

export const statusOptions = () =>
  TaskStatus.map((status) => ({
    label: status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()),
    value: status
  }));

// This is for type safety, ensuring that any variable of type TaskStatusType can only be one of the values in the TaskStatus array.
// TypeScript willTaskStatusType prevent assigning any incorrect value.
export type TaskStatusType = (typeof TaskStatus)[number];
