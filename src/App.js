import { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";

function App() {
  const [sheets, setSheets] = useState([]);
  const [sheets1, setSheets1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saleOutError, setSaleOutError] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Lấy file người dùng tải lên
    const reader = new FileReader();
    setLoading(true);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result); // Chuyển đổi file thành dữ liệu kiểu Uint8Array
      const workbook = XLSX.read(data, { type: "array" }); // Đọc dữ liệu Excel

      const sheetNames = workbook.SheetNames; // Lấy danh sách tất cả các sheet
      const sheetData = sheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];

        // Chuyển đổi sheet thành JSON và loại bỏ khoảng trắng trong header
        const data = XLSX.utils.sheet_to_json(sheet, {
          header: 1, // Lấy dữ liệu dạng mảng, sau đó xử lý header
        });

        // Xử lý header: loại bỏ khoảng trắng cho dòng đầu tiên (header)
        const headers = data[0].map((header) =>
          header
            ?.trim()
            ?.toLowerCase()
            ?.replace(/[^a-zA-Z0-9 ]/g, "")
            ?.replaceAll(" ", "_")
        );

        // Kết hợp lại dữ liệu với header đã được làm sạch
        const cleanData = data.slice(1).map((row) =>
          row.reduce((acc, value, index) => {
            acc[headers[index]] = value;
            return acc;
          }, {})
        );

        return {
          name: sheetName,
          data: cleanData,
        };
      });

      setSheets(sheetData); // Lưu sheet data vào state
      setLoading(false);
    };

    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  };

  const handleFileUpload1 = (event) => {
    const file = event.target.files[0]; // Lấy file người dùng tải lên
    const reader = new FileReader();
    setLoading(true);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result); // Chuyển đổi file thành dữ liệu kiểu Uint8Array
      const workbook = XLSX.read(data, { type: "array" }); // Đọc dữ liệu Excel

      const sheetNames = workbook.SheetNames; // Lấy danh sách tất cả các sheet
      const sheetData = sheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];

        // Chuyển đổi sheet thành JSON và loại bỏ khoảng trắng trong header
        const data = XLSX.utils.sheet_to_json(sheet, {
          header: 1, // Lấy dữ liệu dạng mảng, sau đó xử lý header
        });

        // Xử lý header: loại bỏ khoảng trắng cho dòng đầu tiên (header)
        const headers = data[0].map((header) =>
          header
            ?.trim()
            ?.toLowerCase()
            ?.replace(/[^a-zA-Z0-9 ]/g, "")
            ?.replaceAll(" ", "_")
        );

        // Kết hợp lại dữ liệu với header đã được làm sạch
        const cleanData = data.slice(1).map((row) =>
          row.reduce((acc, value, index) => {
            acc[headers[index]] = value;
            return acc;
          }, {})
        );

        return {
          name: sheetName,
          data: cleanData,
        };
      });

      setSheets1(sheetData); // Lưu sheet data vào state
      setLoading(false);
    };

    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  };

  const onCheck = () => {
    console.log("Processing....");
    setLoading(true);
    const saleOuts = sheets[0]?.data || [];
    // const clostClaims = sheets[1].data;
    // const damageClaims = sheets[2].data;
    // const preSaleCancel = sheets[3].data;
    // const penalty = sheets[4].data;
    // const sallerVoucher = sheets[5].data;
    const commissions = sheets[6]?.data || [];
    const payments = sheets[7]?.data || [];
    const shippings = sheets[13]?.data || [];
    // const lcp = sheets[14].data;
    // const reimburment = sheets[18].data;
    const affiliates = sheets[19]?.data || [];
    const sfps = sheets[20]?.data || [];

    sheets1.forEach((x) => {
      if (x.name === "Order details") {
        const dataList = x.data;
        dataList.forEach((data) => {
          const orderId = data["orderadjustment_id"];
          const actualReturnShippingFee = data["actual_return_shipping_fee"];
          const actualShippingFee = data["actual_shipping_fee"];
          const affiliateCommission = data["affiliate_commission"];
          // const customerRefund = data["customer_refund"];
          const platformShippingFeeDiscount =
            data["platform_shipping_fee_discount"];
          const sellerShippingFee = data["seller_shipping_fee"];
          // const sellerShippingFeeDiscount = data["seller_shipping_fee_discount"];
          const sfpServiceFee = data["sfp_service_fee"];
          // const shippingFeeSubsidy = data["shipping_fee_subsidy"];
          // const subtotalAfterSellerDiscounts = data["subtotal_after_seller_discounts"];
          // const subtotalBeforeDiscounts = data["subtotal_before_discounts"];
          const tiktokShopCommissionFee = data["tiktok_shop_commission_fee"];
          // const totalFees = data["total_fees"];
          const totalRevenue = data["total_revenue"];
          // const totalSettlementAmount = data["total_settlement_amount"];
          const transactionFee = data["transaction_fee"];
          const customerShippingFee = data["customer_shipping_fee"];
          const refundCustomerShippingFee =
            data["refund_customer_shipping_fee"];

          if (!sheetSaleOut(saleOuts, orderId, totalRevenue)) {
            console.log("Sale Out " + orderId + ` ${totalRevenue}`);
          }

          if (
            !sheetCommissionFees(commissions, orderId, tiktokShopCommissionFee)
          ) {
            console.log(
              "Commission Fee " + orderId + ` ${tiktokShopCommissionFee}`
            );
          }

          if (!sheetPaymentFee(payments, orderId, transactionFee)) {
            console.log("Payment fee " + orderId + ` ${transactionFee}`);
          }

          const totlaShippingFee =
            Number(actualShippingFee || 0) +
            Number(sellerShippingFee || 0) +
            Number(platformShippingFeeDiscount || 0) +
            Number(customerShippingFee || 0) +
            Number(refundCustomerShippingFee || 0) +
            Number(actualReturnShippingFee || 0);

          if (!sheetShippingFee(shippings, orderId, totlaShippingFee)) {
            console.log("Shipping fee " + orderId + ` ${totlaShippingFee}`);
          }

          if (!sheetAffiliateFee(affiliates, orderId, affiliateCommission)) {
            console.log(
              "Affiliate Commission " + orderId + ` ${affiliateCommission}`
            );
          }

          if (!sheetSfpFee(sfps, orderId, sfpServiceFee)) {
            console.log("Sfp fee " + orderId + ` ${sfpServiceFee}`);
          }
        });
      }
    });
    setLoading(false);

    console.log("Done!");
  };

  const sheetSaleOut = (saleOuts, orderId, totalRevenue) => {
    const dateFilter = saleOuts?.filter((x) => x["order_id"] === orderId);
    const result = dateFilter.reduce((acc, item) => {
      acc += item.statement_amount;
      return acc;
    }, 0);

    return Math.abs(parseFloat(result).toFixed(2)) == Math.abs(totalRevenue);
  };

  const sheetCommissionFees = (
    commissionFees,
    orderId,
    tiktokShopCommissionFee
  ) => {
    const dateFilter = commissionFees?.filter((x) => x["order_id"] === orderId);

    const result = dateFilter.reduce((acc, item) => {
      acc += item.total;
      return acc;
    }, 0);

    return (
      Math.abs(parseFloat(result).toFixed(2)) ==
      Math.abs(tiktokShopCommissionFee)
    );
  };

  const sheetPaymentFee = (payments, orderId, transactionFee) => {
    const dateFilter = payments?.filter((x) => x["order_id"] === orderId);
    const result = dateFilter.reduce((acc, item) => {
      acc += item.total;
      return acc;
    }, 0);

    return Math.abs(parseFloat(result).toFixed(2)) == Math.abs(transactionFee);
  };

  const sheetShippingFee = (payments, orderId, transactionFee) => {
    const dateFilter = payments?.filter((x) => x["order_id"] === orderId);
    const result = dateFilter.reduce((acc, item) => {
      const total =
        item.actual_shipping_fee +
        item.platform_shipping_fee_discount +
        item.customer_shipping_fee +
        item.refund_customer_shipping_fee +
        item.actual_return_shipping_fee +
        item.shipping_fee_tiktok;

      acc += total;
      return acc;
    }, 0);

    return Math.abs(parseFloat(result).toFixed(2)) == Math.abs(transactionFee);
  };

  const sheetAffiliateFee = (affiliates, orderId, transactionFee) => {
    const dateFilter = affiliates?.filter((x) => x["order_id"] === orderId);
    const result = dateFilter.reduce((acc, item) => {
      acc += item.total;
      return acc;
    }, 0);

    return Math.abs(parseFloat(result).toFixed(2)) == Math.abs(transactionFee);
  };

  const sheetSfpFee = (sfps, orderId, transactionFee) => {
    const dateFilter = sfps?.filter((x) => x["order_id"] === orderId);
    const result = dateFilter.reduce((acc, item) => {
      acc += item.sfp || 0;
      return acc;
    }, 0);

    return Math.abs(parseFloat(result).toFixed(2)) == Math.abs(transactionFee);
  };

  return (
    <div className="App">
      <h1>Excel File Reader</h1>
      {loading && <div>Upload file</div>}
      {!loading && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span>Onpoint file: </span>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "start" }}>
              <span>Platform file: </span>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload1}
              />
            </div>
          </div>
          <button
            style={{ marginTop: "50px", padding: "20px", width: "200px" }}
            onClick={() => onCheck()}
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
