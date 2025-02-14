export const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, idx) => [el, idx]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      return order !== 0 ? order : a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};