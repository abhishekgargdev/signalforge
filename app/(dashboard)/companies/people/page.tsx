import { redirect } from 'next/navigation';

export default function CompaniesPeopleRedirect() {
  redirect('/companies?tab=people');
}
