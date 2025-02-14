import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Checkbox,
    Paper,
    TableSortLabel,
    TablePagination,
    Tooltip,
    TextField,
    Box,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { getRelativeTime } from "./helpers/time/getRelativeTime";
import { getComparator } from "./helpers/sorting/getComparator";
import { stableSort } from "./helpers/sorting/stableSort";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { Button } from "../Button/Button";
import { ReactComponent as DeleteIcon } from "../../assets/images/delete.svg";
import { ReactComponent as LockIcon } from "../../assets/images/lock_person.svg";
import { ReactComponent as UnlockIcon } from "../../assets/images/lock_open.svg";
import { ReactComponent as GrantIcon } from "../../assets/images/grant_admin.svg";
import { ReactComponent as RevokeIcon } from "../../assets/images/revoke_admin.svg";

export const UserManagementTable = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const { fetchWithAuth } = useFetchWithAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
        const response = await fetchWithAuth("http://localhost:5000/api/users");
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(data);
        } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
        }
    };

    const handleAction = async (action) => {
        try {
        const response = await fetchWithAuth(`http://localhost:5000/api/users/${action}`, {
            method: action === "delete" ? "DELETE" : "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ userIds: selectedUsers }),
        });

        if (response.ok) {
            fetchUsers();
            setSelectedUsers([]);
            alert(`The ${action} operation is successfully performed.`);
        } else {
            alert(`Failed to ${action} users`);
            console.error(`Failed to ${action} users`);
        }
        } catch (error) {
        console.error("Error updating users:", error);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
        const allUserIds = users.map((u) => u.id);
        setSelectedUsers(allUserIds);
        } else {
        setSelectedUsers([]);
        }
    };

    const handleRowSelection = (userId) => {
        setSelectedUsers((prev) =>
        prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const isSelected = (id) => selectedUsers.includes(id);

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedUsers = stableSort(users, getComparator(order, orderBy));

    const query = searchTerm.toLowerCase();
    const filteredUsers = sortedUsers.filter((user) => {
        return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
        );
    });

    const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const tableSortLabelStyles = {
        '& .MuiTableSortLabel-icon': {
        color: 'inherit !important'
        },
        '&.Mui-active': {
        color: 'inherit !important',
        '& .MuiTableSortLabel-icon': {
            color: 'inherit !important'
        }
        }
    };

    return (
        <Paper className="mb-[4vw] p-4 rounded shadow w-full max-[768px]:mb-[9vh] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 mb-4 rounded">
            {error}
            </div>
        )}
        <Toolbar className="flex justify-between bg-gray-50 dark:bg-gray-700 rounded-t">
            <Box className="flex items-center w-full gap-2">
                <TextField
                    variant="outlined"
                    size="small"
                    label="Search"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    className="bg-white dark:bg-gray-600 dark:focus:ring-yellow-500"
                />
                <Button onClick={() => handleAction("block")} text={<LockIcon className="w-1/2 h-1/2 m-auto" />}/>
                <Button onClick={() => handleAction("unblock")} text={<UnlockIcon className="w-1/2 h-1/2 m-auto" />}/>
                <Button onClick={() => handleAction("delete")} text={<DeleteIcon className="w-1/2 h-1/2 m-auto" />}/>
                <Button onClick={() => handleAction("grant-admin")} text={<GrantIcon className="w-1/2 h-1/2 m-auto" />}/>
                <Button onClick={() => handleAction("revoke-admin")} text={<RevokeIcon className="w-1/2 h-1/2 m-auto" />}/>
            </Box>
        </Toolbar>
        <TableContainer className="text-gray-900 dark:text-gray-100">
            <Table>
            <TableHead>
                <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                    className="dark:text-gray-100"
                    indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < filteredUsers.length
                    }
                    checked={
                        filteredUsers.length > 0 &&
                        selectedUsers.length === filteredUsers.length
                    }
                    onChange={handleSelectAll}
                    />
                </TableCell>
                <TableCell sortDirection={orderBy === "name" ? order : false}>
                    <TableSortLabel
                        className="dark:text-yellow-500 dark:hover:text-yellow-600 dark:focus:text-yellow-600"
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, "name")}
                        sx={tableSortLabelStyles}
                    >
                    Name
                    {orderBy === "name" ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "email" ? order : false}>
                    <TableSortLabel
                        className="dark:text-yellow-500 dark:hover:text-yellow-600 dark:focus:text-yellow-600"
                        active={orderBy === "email"}
                        direction={orderBy === "email" ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, "email")}
                        sx={tableSortLabelStyles}
                    >
                    Email
                    {orderBy === "email" ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "last_login" ? order : false}>
                    <TableSortLabel
                        className="dark:text-yellow-500 dark:hover:text-yellow-600 dark:focus:text-yellow-600"
                        active={orderBy === "last_login"}
                        direction={orderBy === "last_login" ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, "last_login")}
                        sx={tableSortLabelStyles}
                    >
                    Last Login
                    {orderBy === "last_login" ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "status" ? order : false}>
                    <TableSortLabel
                        className="dark:text-yellow-500 dark:hover:text-yellow-600 dark:focus:text-yellow-600"
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, "status")}
                        sx={tableSortLabelStyles}
                    >
                    Status
                    {orderBy === "status" ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "is_admin" ? order : false}>
                    <TableSortLabel
                        className="dark:text-yellow-500 dark:hover:text-yellow-600 dark:focus:text-yellow-600"
                        active={orderBy === "is_admin"}
                        direction={orderBy === "is_admin" ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, "is_admin")}
                        sx={tableSortLabelStyles}
                    >
                    Admin
                    {orderBy === "is_admin" ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginatedUsers.map((user) => {
                const selected = isSelected(user.id);
                const displayNameStyle =
                    user.status === "blocked"
                    ? { textDecoration: "line-through", opacity: 0.6 }
                    : {};
                return (
                    <TableRow 
                        key={user.id} 
                        hover 
                        selected={selected}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                    <TableCell padding="checkbox" className="dark:text-gray-100">
                        <Checkbox
                            className="dark:text-gray-100"
                            checked={selected}
                            onChange={() => handleRowSelection(user.id)}
                        />
                    </TableCell>
                    <TableCell className="dark:text-gray-100">
                        <span style={displayNameStyle}>{user.name}</span>
                        {user.title && (
                            <div style={{ fontSize: "0.8rem", color: "gray" }}>
                                {user.title}
                            </div>
                        )}
                    </TableCell>
                    <TableCell className="dark:text-gray-100">{user.email}</TableCell>
                    <TableCell className="dark:text-gray-100">
                        {user.last_login ? (
                            <Tooltip title={new Date(user.last_login).toLocaleString()} arrow>
                                <span>{getRelativeTime(user.last_login)}</span>
                            </Tooltip>
                        ) : (
                            "N/A"
                        )}
                    </TableCell>
                    <TableCell className="dark:text-gray-100">{user.status || "N/A"}</TableCell>
                    <TableCell className="dark:text-gray-100">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                        user.is_admin 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                        {user.is_admin ? 'Yes' : 'No'}
                        </span>
                    </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            className="dark:text-gray-100"
            component="div"
            count={filteredUsers.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
                '& .MuiTablePagination-actions': {
                    color: 'inherit',
                },
                '& .MuiIconButton-root': {
                    color: 'inherit',
                },
                '& .MuiIconButton-root .MuiSvgIcon-root': {
                    fill: 'currentColor',
                },
                '& .MuiTablePagination-select': {
                    color: 'inherit',
                },
                '& .MuiTablePagination-selectIcon': {
                    color: 'inherit',
                },
            }}
        />
        </Paper>
    );
};