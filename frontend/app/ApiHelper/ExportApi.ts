import { ApiClient } from "./ApiClient";

interface ExportOptions {
  filename?: string;
}

/** Helper to deeply flatten objects so ALL data is exported cleanly */
function flattenObject(ob: any): any {
  if (!ob) return {};
  const toReturn: any = {};
  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if ((typeof ob[i]) === 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
      const flatObject = flattenObject(ob[i]);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else if (Array.isArray(ob[i])) {
      toReturn[i] = ob[i].map((item: any) => typeof item === 'object' ? JSON.stringify(item) : item).join(", ");
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

/** Helper to export to Excel natively */
async function exportToExcel(data: any[], defaultFilename: string, options: ExportOptions) {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }
  // Dynamic import to reduce initial bundle size/unused JS
  const xlsx = await import("xlsx");
  const flatData = data.map(flattenObject);
  const worksheet = xlsx.utils.json_to_sheet(flatData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  xlsx.writeFile(workbook, options.filename || `${defaultFilename}.xlsx`);
}

/** Helper to export to PDF natively */
async function exportToPdf(data: any[], defaultFilename: string, title: string, options: ExportOptions) {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }
  // Dynamic imports to reduce initial bundle size/unused JS
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable")
  ]);

  const flatData = data.map(flattenObject);
  
  // Extract all unique headers
  const headersSet = new Set<string>();
  flatData.forEach(item => Object.keys(item).forEach(k => headersSet.add(k)));
  const headers = Array.from(headersSet);
  
  const body = flatData.map(item => headers.map(h => (item[h] !== null && item[h] !== undefined) ? String(item[h]).substring(0, 50) : ""));

  const doc = new jsPDF("landscape");
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 20,
    styles: { fontSize: 8, cellPadding: 1 },
    headStyles: { fillColor: [66, 66, 66] },
  });

  doc.save(options.filename || `${defaultFilename}.pdf`);
}

// ==================== Categories Export ====================

export async function exportCategoriesExcel(options: ExportOptions = {}): Promise<void> {
  const data = await ApiClient.get("api/admin/Categories");
  await exportToExcel(data, `categories_${new Date().toISOString().split("T")[0]}`, options);
}

export async function exportCategoriesPdf(options: ExportOptions = {}): Promise<void> {
  const data = await ApiClient.get("api/admin/Categories");
  await exportToPdf(data, `categories_${new Date().toISOString().split("T")[0]}`, "Categories Export", options);
}

// ==================== Items Export ====================

export async function exportItemsExcel(options: ExportOptions = {}): Promise<void> {
  const data = await ApiClient.get("api/admin/Item");
  await exportToExcel(data, `items_${new Date().toISOString().split("T")[0]}`, options);
}

export async function exportItemsPdf(options: ExportOptions = {}): Promise<void> {
  const data = await ApiClient.get("api/admin/Item");
  await exportToPdf(data, `items_${new Date().toISOString().split("T")[0]}`, "Items Export", options);
}

// ==================== Orders Export ====================

export async function exportOrdersExcel(options: ExportOptions = {}): Promise<void> {
  const data = await ApiClient.get("api/admin/Orders");
  await exportToExcel(data, `orders_${new Date().toISOString().split("T")[0]}`, options);
}

export async function exportOrdersPdf(options: ExportOptions = {}): Promise<void> {
  const data = await ApiClient.get("api/admin/Orders");
  await exportToPdf(data, `orders_${new Date().toISOString().split("T")[0]}`, "Orders Export", options);
}

// ==================== Users Export ====================

export async function exportUsersExcel(options: ExportOptions = {}): Promise<void> {
  const data = await ApiClient.get("api/admin/Users");
  await exportToExcel(data, `users_${new Date().toISOString().split("T")[0]}`, options);
}

export async function exportUsersPdf(options: ExportOptions = {}): Promise<void> {
  const data = await ApiClient.get("api/admin/Users");
  await exportToPdf(data, `users_${new Date().toISOString().split("T")[0]}`, "Users Export", options);
}

// ==================== Combined Export Functions ====================

export async function exportAllCategories(options: ExportOptions = {}): Promise<void> {
  await Promise.all([exportCategoriesExcel(options), exportCategoriesPdf(options)]);
}

export async function exportAllItems(options: ExportOptions = {}): Promise<void> {
  await Promise.all([exportItemsExcel(options), exportItemsPdf(options)]);
}

export async function exportAllOrders(options: ExportOptions = {}): Promise<void> {
  await Promise.all([exportOrdersExcel(options), exportOrdersPdf(options)]);
}

export async function exportAllUsers(options: ExportOptions = {}): Promise<void> {
  await Promise.all([exportUsersExcel(options), exportUsersPdf(options)]);
}

// ==================== Default Export ====================

export const Export = {
  categories: { excel: exportCategoriesExcel, pdf: exportCategoriesPdf, all: exportAllCategories },
  items: { excel: exportItemsExcel, pdf: exportItemsPdf, all: exportAllItems },
  orders: { excel: exportOrdersExcel, pdf: exportOrdersPdf, all: exportAllOrders },
  users: { excel: exportUsersExcel, pdf: exportUsersPdf, all: exportAllUsers },
};

export default Export;
