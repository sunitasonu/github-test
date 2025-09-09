import React, { useEffect ,useRef, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { fetchData } from "@/utils/api";

const PrintAavak = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aavakData, setAavakData] = React.useState(null);
  const printRef = useRef();
  const [printMode, setPrintMode] = useState("A5");


useEffect(() => {
  const getAavak = async () => {
      try {
        const data = await fetchData(`/avak-print-bill/${id}`);
        setAavakData(data);
      } catch (err) {
        console.error("Error fetching Aavak data:", err);
      }
  };

  getAavak();
    window.focus(); // Auto-focus for print
  }, [id]);

  if (!aavakData) {
    return <div>Loading Aavak Print Data...</div>;
  }

const formatCurrency = (amount) => {
  const value = Number(amount);
  if (isNaN(value)) return "₹0.00";

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

  const handlePrint = () => {
    window.print();
  };

return (
    <div className="min-h-screen bg-white print-container">
      {/* Print Header - Hidden in print */}
      <div className="print:hidden bg-gray-50 p-4 border-b">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* <Button variant="ghost" onClick={() => navigate(`/aavak/${id}`)}> */}
             <Button variant="ghost" onClick={() => navigate(`/aavak`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Aavak
          </Button>
          {/* <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button> */}
          <div className="space-x-2">
            <Button
              variant={printMode === "A5" ? "default" : "outline"}
              onClick={() => setPrintMode("A5")}
            >
              A5
            </Button>
            <Button
              variant={printMode === "Thermal" ? "default" : "outline"}
              onClick={() => setPrintMode("Thermal")}
            >
              58mm
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Print Content */}
      {/* <div className="max-w-4xl mx-auto p-8 print:p-4 print:max-w-none" > */}
      <div
        ref={printRef}
        className={`print-content mx-auto mt-4 max-w-4xl  p-8 print:p-4 print:max-w-none border border-black ${
          printMode === "Thermal" ? "thermal" : "a5"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8 print:mb-4">
          <h1 className="text-3xl font-bold print:text-2xl">AAVAK</h1>
          <p className="text-lg text-muted-foreground print:text-base">
            Vegetable Purchase Receipt
          </p>
        </div>

        {/* Bill Information */}
        <div className="grid grid-cols-3 gap-8 mb-8 print:gap-4 print:mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Bill Number
            </p>
            <p className="text-lg font-semibold">{aavakData?.billNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="text-lg">
             {new Date().toLocaleDateString("en-GB", {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Farmer Name
            </p>
            <p className="text-lg">{aavakData?.farmerName}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 print:mb-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left">Sr.</th>
                <th className="border border-gray-300 p-2 text-left">
                  Veg
                </th>
                <th className="border border-gray-300 p-2 text-right">Qty</th>
                <th className="border border-gray-300 p-2 text-center">Unit</th>
                <th className="border border-gray-300 p-2 text-right">Rate</th>
                <th className="border border-gray-300 p-2 text-right">
                  Amt
                </th>
                {/* <th className="border border-gray-300 p-2 text-right">
                  Hamali
                </th>
                <th className="border border-gray-300 p-2 text-right">Total</th> */}
              </tr>
            </thead>
            <tbody>
              {aavakData?.items?.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {item.vegetable}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.unit}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(item.quantity * item.rate)}
                  </td>
                  {/* <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(item.hamaliAmount)}
                  </td>
                  <td className="border border-gray-300 p-2 text-right font-medium">
                    {formatCurrency(item.totalAmount)}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Vehicle Rent:</span>
                <span>{formatCurrency(aavakData.vehicleRent)}</span>
              </div>
              <div className="flex justify-between">
                <span>Advance:</span>
                <span>{formatCurrency(aavakData.advance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Hamali:</span>
                <span>{formatCurrency(aavakData.totalHamali)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg mb-4">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(aavakData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Net Expence:</span>
                <span>{formatCurrency(aavakData.netExpence)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Grand Total:</span>
                <span>{formatCurrency(aavakData.grandTotal)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Amount:</span>
                  <span className="text-green-600">
                    {formatCurrency(aavakData.netAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 print:mt-8 pt-8 border-t">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium">Farmer Signature</p>
              <div className="h-16 border-b border-gray-300 mt-4"></div>
            </div>
            <div>
              <p className="text-sm font-medium">Authorized Signature</p>
              <div className="h-16 border-b border-gray-300 mt-4"></div>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-2">
              Generated on {new Date().toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      {/* <style>
        {`
          @media print {
            body {
              font-size: 12pt;
              line-height: 1.4;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .print\\:p-4 {
              padding: 1rem !important;
            }
            
            .print\\:max-w-none {
              max-width: none !important;
            }
            
            .print\\:text-2xl {
              font-size: 1.5rem !important;
            }
            
            .print\\:text-base {
              font-size: 1rem !important;
            }
            
            .print\\:mb-4 {
              margin-bottom: 1rem !important;
            }
            
            .print\\:gap-4 {
              gap: 1rem !important;
            }
            
            .print\\:mt-8 {
              margin-top: 2rem !important;
            }
            
            table {
              page-break-inside: avoid;
            }
            
            tr {
              page-break-inside: avoid;
            }
          }
        `}
      </style> */}

           {/* 🔹 Custom Print CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .print-content, .print-content * {
            visibility: visible;
          }

          .print-content {
            position: absolute;
            left: 0;
            top: 0;
          }

          .print-content.thermal {
            width: 58mm !important;
            font-size: 10pt !important;
            padding: 6px !important;
          }

          .print-content.a5 {
            width: 148mm !important;
            height: 210mm !important;
            font-size: 12pt;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintAavak;
