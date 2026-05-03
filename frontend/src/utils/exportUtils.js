import * as XLSL from "xlsx";

export const exportToExcel = (data, filename = "transaction") => {
  if (!data || data.length === 0) {
    alert("No Data to export !!!");
    return;
  }

  try {
    const worksheet = XLSL.utils.json_to_sheet(data);
    //create a workbook
    const workbook = XLSL.utils.book_new();
    XLSL.utils.book_append_sheet(workbook, worksheet, "Transactions");

    //Generate a Excel file and trigger download
    XLSL.writeFile(workbook, `${filename}.xlsx`, {
      bookType: "xlsx",
      type: "array",
    });
  } catch (error) {
    console.error("Export error:", error);
    alert("Error in exporting data. Please try again later");
  }
};
