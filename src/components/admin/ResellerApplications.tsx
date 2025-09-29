'use client';

import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../lib/firebase/client";

interface ResellerApplication {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  occupation: string;
  region: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  pdfUrl?: string; 
}

const ResellerApplications: React.FC = () => {
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "resellerApplications"));
      const apps: ResellerApplication[] = [];

      querySnapshot.forEach((snap) => {
        const data = snap.data() as Omit<ResellerApplication, "id">;
        apps.push({ id: snap.id, ...data });
      });

      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    try {
      const docRef = doc(db, "resellerApplications", id);
      await updateDoc(docRef, { status: action });
      alert(`Application ${action}`);
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleViewPdf = (pdfUrl?: string) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("No PDF available for this application.");
    }
  };

  const handleDownloadPdf = async (pdfUrl?: string, fullName?: string) => {
    if (!pdfUrl) {
      alert("No PDF to download.");
      return;
    }

    try {
      let url = pdfUrl;

      if (pdfUrl.startsWith("reseller_docs/")) {
        const storageRef = ref(storage, pdfUrl);
        url = await getDownloadURL(storageRef);
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = fullName ? `${fullName.replace(/\s+/g, "_")}_application.pdf` : "application.pdf";
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <div className="p-6">Loading applications...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reseller Applications</h1>

      {applications.length === 0 ? (
        <p>No reseller applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Full Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Occupation</th>
                <th className="border p-2">Region</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">PDF</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className={app.status === "pending" ? "bg-yellow-50" : app.status === "approved" ? "bg-green-50" : "bg-red-50"}>
                  <td className="border p-2 font-medium">{app.fullName}</td>
                  <td className="border p-2">{app.phone}</td>
                  <td className="border p-2">{app.email || "N/A"}</td>
                  <td className="border p-2">{app.occupation}</td>
                  <td className="border p-2">{app.region}</td>
                  <td className="border p-2">{app.location}</td>
                  <td className="border p-2 capitalize">{app.status}</td>
                  <td className="border p-2">
                    <button
                      className="text-blue-600 underline mr-2"
                      onClick={() => handleViewPdf(app.pdfUrl)}
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 underline"
                      onClick={() => handleDownloadPdf(app.pdfUrl, app.fullName)}
                    >
                      Download
                    </button>
                  </td>
                  <td className="border p-2">
                    {app.status === "pending" ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleAction(app.id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleAction(app.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResellerApplications;
