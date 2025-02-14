import { UserManagementTable } from "../../components/UserManagementTable/UserManagementTable";

export const UserManagementPage = () => {
  return (
    <div className="m-auto flex flex-col items-left justify-center w-4/5">
      <header className="my-12 flex justify-between items-center w-1/2 max-[768px]:w-full h-16 max-[768px]:h-14 max-[768px]:my-14 bg-white px-4 py-2 rounded-md">
      </header>
      <UserManagementTable/>
    </div>
  );
};