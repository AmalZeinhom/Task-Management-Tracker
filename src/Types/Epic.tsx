export type Epic = {
  id: string;
  epic_id: string;
  title: string;
  description?: string;
  deadline?: string;
  created_at: string;
  project_id: string;

  assignee_id?: string | null;

  created_by: User;

  assignee?: User | null;
};

type User = {
  sub: string;
  name: string;
  email: string;
  department: string;
};
