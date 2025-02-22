import { UserManagementTable } from "../../components/UserManagementTable/UserManagementTable";

export const UserManagementPage = () => {
  return (
    <div className="py-[6vw]">
        <div className="m-auto flex flex-col items-left justify-center w-4/5">
            <UserManagementTable/>
        </div>
    </div>
  );
};