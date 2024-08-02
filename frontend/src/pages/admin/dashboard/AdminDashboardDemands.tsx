import { useEffect, useState } from "react";
import axiosInstance from "@/components/AxiosInstance.tsx";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default function AdminDashBoardDemands() {
  const [updateRequests, setUpdateRequests] = useState([]);
  const [deleteRequests, setDeleteRequests] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("dashboard_admin/list_all_requests/")
      .then((res) => {
        console.log("Fetched update requests:", res.data);
        setUpdateRequests(res.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the update requests!",
          error
        );
      });

    axiosInstance
      .get("dashboard_admin/pending-deletes/")
      .then((res) => {
        console.log("Fetched delete requests:", res.data);
        setDeleteRequests(res.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the delete requests!",
          error
        );
      });
  }, []);

  const handleApproveUpdate = (id) => {
    axiosInstance
      .post(`dashboard_admin/${id}/approve-update/`)
      .then((res) => {
        console.log("Approved update request:", res.data);
        setUpdateRequests(
          updateRequests.filter((request) => request.user !== id)
        );
      })
      .catch((error) => {
        console.error("Error approving update request:", error);
      });
  };

  const handleDeclineUpdate = (id) => {
    axiosInstance
      .post(`dashboard_admin/${id}/decline-update/`)
      .then((res) => {
        console.log("Declined update request:", res.data);
        setUpdateRequests(
          updateRequests.filter((request) => request.user !== id)
        );
      })
      .catch((error) => {
        console.error("Error declining update request:", error);
      });
  };

  const handleApproveDelete = (id) => {
    console.log("the id to delete is : ", id);
    axiosInstance
      .post(`dashboard_admin/${id}/approve-delete/`)
      .then((res) => {
        console.log("Approved delete request:", res.data);
        setDeleteRequests(
          deleteRequests.filter((request) => request.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error approving delete request:", error);
      });
  };

  const handleDeclineDelete = (id) => {
    axiosInstance
      .post(`dashboard_admin/${id}/deny-delete/`)
      .then((res) => {
        console.log("Declined delete request:", res.data);
        setDeleteRequests(
          deleteRequests.filter((request) => request.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error declining delete request:", error);
      });
  };

  return (
    // <section className="h-full min-h-screen w-full bg-muted/20 px-16 py-5 lg:ml-52 lg:px-5 xl:ml-60">
    <main className="h-full min-h-screen w-full bg-muted/20 px-16 py-5 lg:ml-52 lg:px-5 xl:ml-60">
      <h1 className="mb-10 font-jomhuria text-6xl">Requests</h1>
      <section className="flex flex-col items-start gap-10">
        <div>
          <h2 className="mb-4 text-xl font-bold">Pending User Updates</h2>
          {updateRequests.length > 0 ? (
            <ul className="space-y-4">
              {updateRequests.map((request) => (
                <li key={request.user} className="rounded border p-4 shadow">
                  <p>
                    <strong>User ID:</strong> {request.user}
                  </p>
                  <p>
                    <strong>Email:</strong> {request.email}
                  </p>
                  <p>
                    <strong>Current Name:</strong> {request.current_nom}
                    {", "}
                    {request.current_prenom}
                  </p>
                  <p>
                    <strong>Requested Name:</strong> {request.tmp_nom}
                    {", "}
                    {request.tmp_prenom}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <Button
                      className="w-full bg-green-500 text-white shadow-sm hover:bg-green-500/90 dark:bg-green-900 dark:hover:bg-green-900/90"
                      onClick={() => handleApproveUpdate(request.user)}
                    >
                      <Check size={20} />
                    </Button>
                    <Button
                      variant={"destructive"}
                      className=" w-full"
                      onClick={() => handleDeclineUpdate(request.user)}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending updates</p>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">Pending Delete Requests</h2>
          {deleteRequests.length > 0 ? (
            <ul className="space-y-4">
              {deleteRequests.map((request) => (
                <li key={request.id} className="rounded border p-4 shadow">
                  <p>
                    <strong>User ID:</strong> {request.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {request.user_email}
                  </p>
                  <p>
                    <strong>Name:</strong> {request.user_first_name}{" "}
                    {request.user_last_name}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleApproveDelete(request.id)}
                      className="mr-2 rounded bg-green-500 px-4 py-2 text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeclineDelete(request.id)}
                      className="rounded bg-red-500 px-4 py-2 text-white"
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending delete requests</p>
          )}
        </div>
      </section>
    </main>
  );
}
