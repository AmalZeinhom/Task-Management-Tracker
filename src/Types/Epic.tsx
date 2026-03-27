export type Epic = {
  id: string;
  epic_id: string;
  title: string;
  description?: string;
  deadline: string;
  created_at: string;
  project_id: string;
  created_by: {
    sub: string;
    name: string;
    email: string;
    department: string;
  };
  assignee: {
    sub: string;
    name: string;
    email: string;
    department: string;
  };
};
