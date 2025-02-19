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
  Box
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { Button } from "../../components/Button/Button";
import { getComparator } from "../../utils/getComparator";
import { stableSort } from "../../utils/stableSort";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../../assets/images/delete.svg";
import { ReactComponent as EditIcon } from "../../assets/images/edit.svg";
import { ReactComponent as PlayIcon } from "../../assets/images/play.svg";
import { ReactComponent as AddIcon } from "../../assets/images/add.svg";
import { ReactComponent as ResultIcon } from "../../assets/images/result.svg";
import { useTranslation } from "react-i18next";


export default function Surveys() {
  const { fetchWithAuth } = useFetchWithAuth();
  const [surveys, setSurveys] = useState([]);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const { t } = useTranslation();

  useEffect(() => {
    if (status === "idle") {
      fetchSurveys();
    }
  }, [status]);

  async function fetchSurveys() {
    try {
      setStatus("loading");
      const response = await fetchWithAuth("http://localhost:5000/api/surveys");
      if (!response.ok) {
        throw new Error("Failed to load surveys");
      }
      const data = await response.json();
      setSurveys(data);
      setStatus("success");
    } catch (err) {
      console.error("Error fetching surveys:", err);
      setError(err.message);
      setStatus("error");
    }
  }

  async function addSurvey() {
    try {
      const response = await fetchWithAuth("http://localhost:5000/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      if (!response.ok) {
        throw new Error("Failed to create survey");
      }
      await fetchSurveys();
    } catch (error) {
      console.error("Add survey error:", error);
    }
  }

  async function removeSelectedSurveys() {
    try {
      for (const surveyId of selected) {
        const response = await fetchWithAuth(
          `http://localhost:5000/api/surveys/${surveyId}`,
          {
            method: "DELETE"
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to remove survey ${surveyId}`);
        }
      }
      setSelected([]);
      fetchSurveys();
    } catch (error) {
      console.error("Remove survey error:", error);
    }
  }

  function handleRequestSort(event, property) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const query = searchTerm.toLowerCase();
  const filteredSurveys = surveys.filter((survey) => {
    const nameMatch = survey.name?.toLowerCase().includes(query);
    const descMatch = survey.description?.toLowerCase().includes(query);
    const tagsMatch = survey.tags?.toLowerCase().includes(query);
    return nameMatch || descMatch || tagsMatch;
  });

  const sortedSurveys = stableSort(filteredSurveys, getComparator(order, orderBy));
  const paginatedSurveys = sortedSurveys.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isSelected = (id) => selected.indexOf(id) !== -1;

  function handleSelectAll(event) {
    if (event.target.checked) {
      const allIds = filteredSurveys.map((s) => s.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  }

  function handleRowSelection(surveyId) {
    setSelected((prev) =>
      prev.includes(surveyId) ? prev.filter((id) => id !== surveyId) : [...prev, surveyId]
    );
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const tableSortLabelStyles = {
    "& .MuiTableSortLabel-icon": {
      color: "inherit !important"
    },
    "&.Mui-active": {
      color: "inherit !important",
      "& .MuiTableSortLabel-icon": {
        color: "inherit !important"
      }
    }
  };

  if (status === "loading") {
    return <div>Loading surveys...</div>;
  }
  if (status === "error") {
    return <div>Error loading surveys: {error}</div>;
  }

  const singleSelectedId = selected.length === 1 ? selected[0] : null;

  return (
    <Paper className="m-auto p-4 rounded shadow w-1/2 max-[768px]:mb-[9vh] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
      <Toolbar className="flex justify-between bg-gray-50 dark:bg-gray-700 rounded-t">
        <Box className="flex items-center w-full gap-2">
          <TextField
            variant="outlined"
            size="small"
            label={t("surveys.search")}
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="bg-white dark:bg-gray-600 dark:focus:ring-yellow-500"
          />
          <Button onClick={addSurvey} text={<AddIcon className="w-1/2 h-1/2 m-auto" />} buttonType="secondary" />
          {singleSelectedId && (
            <>
              <Link to={`run/${singleSelectedId}`} className="inline-flex items-center justify-center">
                <Button text={<PlayIcon className="w-1/2 h-1/2 m-auto" />} buttonType="primary"></Button>
              </Link>
              <Link to={`edit/${singleSelectedId}`} className="inline-flex items-center justify-center">
                <Button text={<EditIcon className="w-1/2 h-1/2 m-auto" />} buttonType="primary" />
              </Link>
              <Link to={`results/${singleSelectedId}`} className="inline-flex items-center justify-center">
                <Button text={<ResultIcon className="w-1/2 h-1/2 m-auto" />} buttonType="primary" />
              </Link>
            </>
          )}
          {selected.length > 0 && (
            <Button
              onClick={removeSelectedSurveys}
              text={<DeleteIcon className="w-1/2 h-1/2 m-auto" />}
              buttonType="tertiary"
            />
          )}
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
                    selected.length > 0 && selected.length < filteredSurveys.length
                  }
                  checked={
                    filteredSurveys.length > 0 &&
                    selected.length === filteredSurveys.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sortDirection={orderBy === "name" ? order : false}>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "name")}
                  sx={tableSortLabelStyles}
                >
                  {t("surveys.name")}
                  {orderBy === "name" && (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  )}
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "description" ? order : false}>
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "description")}
                  sx={tableSortLabelStyles}
                >
                  {t("surveys.description")}
                  {orderBy === "description" && (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  )}
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "tags" ? order : false}>
                <TableSortLabel
                  active={orderBy === "tags"}
                  direction={orderBy === "tags" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "tags")}
                  sx={tableSortLabelStyles}
                >
                  {t("surveys.tags")}
                  {orderBy === "tags" && (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  )}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSurveys.map((survey) => {
              const surveyId = survey.id;
              const isItemSelected = isSelected(surveyId);
              return (
                <TableRow
                  key={surveyId}
                  hover
                  selected={isItemSelected}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell padding="checkbox" className="dark:text-gray-100">
                    <Checkbox
                      className="dark:text-gray-100"
                      checked={isItemSelected}
                      onChange={() => handleRowSelection(surveyId)}
                    />
                  </TableCell>
                  <TableCell className="dark:text-gray-100">{survey.name}</TableCell>
                  <TableCell className="dark:text-gray-100">
                    {survey.description || t("surveys.noDescription")}
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    {survey.tags || t("surveys.noTags")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredSurveys.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="dark:text-gray-100"
        sx={{
          "& .MuiTablePagination-actions": {
            color: "inherit"
          },
          "& .MuiIconButton-root": {
            color: "inherit"
          },
          "& .MuiIconButton-root .MuiSvgIcon-root": {
            fill: "currentColor",
            color: "inherit"
          },
          "& .MuiTablePagination-select": {
            color: "inherit"
          },
          "& .MuiTablePagination-selectIcon": {
            color: "inherit"
          },
          "& .MuiTablePagination-actions .MuiIconButton-root .MuiSvgIcon-root": {
            fill: "currentColor",
            color: "inherit"
          }
        }}
      />
    </Paper>
  );
}
