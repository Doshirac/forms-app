import { UserManagementTable } from "../../components/UserManagementTable/UserManagementTable";

export const UserManagementPage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200
                        dark:from-gray-900 dark:to-gray-800
                        transition-colors duration-300 py-[6vw]">
        <div className="m-auto flex flex-col items-left justify-center w-4/5">
            <UserManagementTable/>
        </div>
    </div>
  );
};