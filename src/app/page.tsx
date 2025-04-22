import { createClient } from '@/utils/supabase/server';

export default async function Users() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();
  if (!users) {
    return <div>No users found</div>;
  }

  return <pre>
    {JSON.stringify(users.map(user=>user.username), null ,1)}
  </pre>

}