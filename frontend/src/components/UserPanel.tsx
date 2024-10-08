import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  CircleUser,
  Send,
  HandCoins,
  DollarSign,
  CircleAlert,
  Loader,
} from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance.tsx";
import { FieldValues, useForm } from "react-hook-form";
import { useUserContext } from "@/contexts/UserContext";
import { Toaster, toast } from "sonner";
import Tier1VisaH from "../assets/images/cards/horizontal/tier1/1/Visa.svg";
import Tier2VisaH from "../assets/images/cards/horizontal/tier2/2/Visa.svg";
import Tier3VisaH from "../assets/images/cards/horizontal/tier3/4/Visa.svg";
import Tier1VisaV from "../assets/images/cards/vertical/tier1/1/Visa.svg";
import Tier2VisaV from "../assets/images/cards/vertical/tier2/2/Visa.svg";
import Tier3VisaV from "../assets/images/cards/vertical/tier3/4/Visa.svg";
import capitalize from "@/utils/capitalize";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencySchema from "@/schemas/CurrencySchema";
import { useState } from "react";

type Activity = {
  name: string;
  date: string;
  amount: string;
  isPositive: boolean;
};

const activities: Activity[] = [
  { name: "Zara", date: "02/03/24", amount: "-$136.45", isPositive: false },
  { name: "Interac", date: "01/13/24", amount: "$750.00", isPositive: true },
];

export default function UserPanel() {
  const { user, setUser } = useUserContext();
  const { t } = useTranslation();

  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [sendMobileDialogOpen, setSendMobileDialogOpen] = useState(false);
  const [requestMobileDialogOpen, setRequestMobileDialogOpen] = useState(false);
  const [depositMobileDialogOpen, setDepositMobileDialogOpen] = useState(false);

  const {
    handleSubmit: handleSubmitSend,
    register: registerSend,
    clearErrors: clearErrorsSend,
    formState: { errors: errorsSend, isSubmitting: isSubmittingSend },
  } = useForm({
    resolver: zodResolver(CurrencySchema()),
    mode: "onSubmit",
  });
  const {
    handleSubmit: handleSubmitRequest,
    register: registerRequest,
    clearErrors: clearErrorsRequest,
    formState: { errors: errorsRequest, isSubmitting: isSubmittingRequest },
  } = useForm({
    resolver: zodResolver(CurrencySchema()),
    mode: "onSubmit",
  });
  const {
    handleSubmit: handleSubmitDeposit,
    register: registerDeposit,
    clearErrors: clearErrorsDeposit,
    formState: { errors: errorsDeposit, isSubmitting: isSubmittingDeposit },
  } = useForm({
    resolver: zodResolver(CurrencySchema()),
    mode: "onSubmit",
  });
  const baseUrl = "http://127.0.0.1:8000";

  type PlanTitle = {
    [key: string]: string;
  };

  const planTitle: PlanTitle = {
    tier1: t("plans.tier1.name"),
    tier2: t("plans.tier2.name"),
    tier3: t("plans.tier3.name"),
  };

  const sendTransaction = async (data: FieldValues) => {
    try {
      console.log("Data being sent:", {
        sender: data.sender,
        receiver: data.receiver,
        amount: parseFloat(data.amount),
      });

      const response = await AxiosInstance.post(
        "transactions/",
        {
          sender: user.email,
          receiver: data.receiver,
          amount: parseFloat(data.amount),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newTransaction = response.data;
      console.log("Transaction successful:", newTransaction);
      const updatedUser = {
        ...user,
        balance: user.balance - newTransaction.amount,
        sent_transactions: [...user.sent_transactions, newTransaction],
      };
      setUser(updatedUser);
      toast.success(`${t("toast.userPanel.sendFunds.success")}`);
      setSendDialogOpen(false);
      setSendMobileDialogOpen(false);
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error(`${t("toast.userPanel.sendFunds.error")}`);
    }
  };

  const requestTransaction = async (data: FieldValues) => {
    try {
      const response = await AxiosInstance.post(
        "request/",
        {
          sender: data.sender,
          receiver: user.email,
          amount: parseFloat(data.amount),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Transaction successful:", response.data);
      toast.info(`${t("toast.userPanel.requestFunds.success")}`);
      setRequestDialogOpen(false);
      setRequestMobileDialogOpen(false);
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error(`${t("toast.userPanel.requestFunds.error")}`);
    }
  };

  const depositTransaction = async (data: FieldValues) => {
    try {
      const response = await AxiosInstance.post(
        `users/add_balance/`,
        { amount: parseFloat(data.amount) },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Data amount:" + response.data.amount);
      const updatedUser = {
        ...user,
        balance: user.balance + parseFloat(data.amount),
      };
      setUser(updatedUser);
      toast.success(`${t("toast.userPanel.depositFunds.success")}`);
      setDepositDialogOpen(false);
      setDepositMobileDialogOpen(false);
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error(`${t("toast.userPanel.depositFunds.error")}`);
    }
  };

  return (
    <aside className="fixed right-0 h-screen w-14 border-l py-5 lg:w-72">
      <aside className="hidden h-full w-full flex-col items-center justify-between px-3 lg:flex">
        <div className="flex w-full flex-col items-center gap-3">
          {user.image_url ? (
            <img
              src={`${baseUrl}${user.image_url}`}
              alt={`${capitalize(user.first_name)} ${capitalize(user.last_name)}`}
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <CircleUser className="size-16" />
          )}
          <h2 className="text-base">{`${capitalize(user.first_name)} ${capitalize(user.last_name)}`}</h2>
          <Badge
            className={`cursor-default rounded-full shadow ${user.plan === "tier1" ? "bg-green-500 hover:bg-green-500" : user.plan === "tier2" ? "bg-gray-500 hover:bg-gray-500" : "bg-yellow-500 hover:bg-yellow-500"}`}
          >
            {planTitle[user.plan]}
          </Badge>
          <div className="mt-7 flex w-full items-center justify-around">
            <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
              <DialogTrigger asChild>
                <div className="flex flex-col items-center">
                  <Button
                    variant={"outline"}
                    className="size-14 rounded-full"
                    onClick={() => {
                      clearErrorsSend("amount"), clearErrorsSend("receiver");
                    }}
                  >
                    <Send size={20} />
                  </Button>
                  <p className="mt-2 text-sm">{t("buttons.sendFunds")}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitSend(sendTransaction)}>
                  <DialogHeader>
                    <DialogTitle>{t("userPanel.sendFunds.title")}</DialogTitle>
                    <DialogDescription>
                      {t("userPanel.sendFunds.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        {t("input.fundsAmount")}
                      </Label>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="$100.00"
                        autoComplete="off"
                        className="col-span-3"
                        {...registerSend("amount", { required: true })}
                        onChange={() => clearErrorsSend("amount")}
                      />
                      {errorsSend.amount && (
                        <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                          <CircleAlert size={20} />
                          {errorsSend.amount.message &&
                            String(errorsSend.amount.message)}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="receiver" className="text-right">
                        {t("input.fundsEmail")}
                      </Label>
                      <Input
                        id="receiver"
                        type="text"
                        placeholder={t("input.recipient")}
                        className="col-span-3"
                        {...registerSend("receiver", { required: true })}
                        onChange={() => clearErrorsSend("receiver")}
                      />
                      {errorsSend.receiver && (
                        <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                          <CircleAlert size={20} />
                          {errorsSend.receiver.message &&
                            String(errorsSend.receiver.message)}
                        </span>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    {/* <DialogClose asChild>
                      <Button type="submit" >{t("buttons.sendFunds")}</Button>
                    </DialogClose> */}
                    <Button type="submit" disabled={isSubmittingSend}>
                      {isSubmittingSend ? (
                        <Loader size={20} className="animate-spin" />
                      ) : (
                        `${t("buttons.sendFunds")}`
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={requestDialogOpen}
              onOpenChange={setRequestDialogOpen}
            >
              <DialogTrigger asChild>
                <div className="flex flex-col items-center">
                  <Button
                    variant={"outline"}
                    className="size-14 rounded-full"
                    onClick={() => {
                      clearErrorsRequest("amount"),
                        clearErrorsRequest("sender");
                    }}
                  >
                    <HandCoins size={20} />
                  </Button>
                  <p className="mt-2 text-sm">{t("buttons.requestFunds")}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitRequest(requestTransaction)}>
                  <DialogHeader>
                    <DialogTitle>
                      {t("userPanel.requestFunds.title")}
                    </DialogTitle>
                    <DialogDescription>
                      {t("userPanel.requestFunds.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        {t("input.fundsAmount")}
                      </Label>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="$100.00"
                        autoComplete="off"
                        className="col-span-3"
                        {...registerRequest("amount", { required: true })}
                        onChange={() => clearErrorsRequest("amount")}
                      />
                      {errorsRequest.amount && (
                        <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                          <CircleAlert size={20} />
                          {errorsRequest.amount.message &&
                            String(errorsRequest.amount.message)}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sender" className="text-right">
                        {t("input.fundsEmail")}
                      </Label>
                      <Input
                        id="sender"
                        type="text"
                        placeholder={t("input.recipient")}
                        className="col-span-3"
                        {...registerRequest("sender", { required: true })}
                        onChange={() => clearErrorsRequest("sender")}
                      />
                      {errorsRequest.sender && (
                        <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                          <CircleAlert size={20} />
                          {errorsRequest.sender.message &&
                            String(errorsRequest.sender.message)}
                        </span>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    {/* <DialogClose asChild>
                      <Button type="submit" >{t("buttons.requestFunds")}</Button>
                    </DialogClose> */}
                    <Button type="submit" disabled={isSubmittingRequest}>
                      {isSubmittingRequest ? (
                        <Loader size={20} className="animate-spin" />
                      ) : (
                        `${t("buttons.requestFunds")}`
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={depositDialogOpen}
              onOpenChange={setDepositDialogOpen}
            >
              <DialogTrigger asChild>
                <div className="flex flex-col items-center">
                  <Button
                    variant={"outline"}
                    className="size-14 rounded-full"
                    onClick={() => clearErrorsDeposit("amount")}
                  >
                    <DollarSign size={20} />
                  </Button>
                  <p className="mt-2 text-sm">{t("buttons.depositFunds")}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitDeposit(depositTransaction)}>
                  <DialogHeader>
                    <DialogTitle>
                      {t("userPanel.depositFunds.title")}
                    </DialogTitle>
                    <DialogDescription>
                      {t("userPanel.depositFunds.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        {t("input.fundsAmount")}
                      </Label>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="$100.00"
                        autoComplete="off"
                        className="col-span-3"
                        {...registerDeposit("amount", { required: true })}
                        onChange={() => clearErrorsDeposit("amount")}
                      />
                      {errorsDeposit.amount && (
                        <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                          <CircleAlert size={20} />
                          {errorsDeposit.amount.message &&
                            String(errorsDeposit.amount.message)}
                        </span>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    {/* <DialogClose asChild>
                      <Button type="submit" >{t("buttons.depositFunds")}</Button>
                    </DialogClose> */}
                    <Button type="submit" disabled={isSubmittingDeposit}>
                      {isSubmittingDeposit ? (
                        <Loader size={20} className="animate-spin" />
                      ) : (
                        `${t("buttons.depositFunds")}`
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative my-4 hidden lg:block">
          <img
            src={
              user.plan === "tier1"
                ? Tier1VisaH
                : user.plan === "tier2"
                  ? Tier2VisaH
                  : Tier3VisaH
            }
            alt="Image of the user's bank card"
            draggable="false"
            className="p-3"
          />
          <p className="absolute bottom-[1.75rem] right-[10rem] select-none text-base font-medium text-white">
            {capitalize(user.first_name)} {capitalize(user.last_name)}
          </p>
        </div>
        <div className="relative my-4 lg:hidden">
          <img
            src={
              user.plan === "tier1"
                ? Tier1VisaV
                : user.plan === "tier2"
                  ? Tier2VisaV
                  : Tier3VisaV
            }
            alt="Image of the user's bank card"
            draggable="false"
            className="p-3"
          />
        </div>
        <div className="mb-5 w-full">
          <h2 className="font-semibold">Activités récentes</h2>
          <div className="space-y-2 rounded-lg border p-2 shadow">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-base">{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <p
                  className={`font-medium ${activity.isPositive ? "text-green-500" : "text-red-500"}`}
                >
                  {activity.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <aside className="flex h-full w-full flex-col items-center lg:hidden">
        {user.image_url ? (
          <img
            src={`${baseUrl}${user.image_url}`}
            alt={`${capitalize(user.first_name)} ${capitalize(user.last_name)}`}
            className="mt-2 size-10 cursor-pointer rounded-full"
          />
        ) : (
          <CircleUser className="mt-2 size-10 cursor-pointer" />
        )}
        <nav className="mb-5 mt-[4.5rem] flex h-full flex-col items-center justify-between">
          <TooltipProvider>
            <div className="flex flex-col items-center gap-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Dialog
                      open={sendMobileDialogOpen}
                      onOpenChange={setSendMobileDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size={"icon"}
                          variant={"ghost"}
                          onClick={() => {
                            clearErrorsSend("amount"),
                              clearErrorsSend("receiver");
                          }}
                        >
                          <Send size={20} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-11/12 rounded-xl sm:max-w-[425px]">
                        <form onSubmit={handleSubmitSend(sendTransaction)}>
                          <DialogHeader>
                            <DialogTitle>
                              {t("userPanel.sendFunds.title")}
                            </DialogTitle>
                            <DialogDescription>
                              {t("userPanel.sendFunds.description")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amount" className="text-right">
                                {t("input.fundsAmount")}
                              </Label>
                              <Input
                                id="amount"
                                type="text"
                                placeholder="$100.00"
                                autoComplete="off"
                                className="col-span-3"
                                {...registerSend("amount", {
                                  required: true,
                                })}
                                onChange={() => clearErrorsSend("amount")}
                              />
                              {errorsSend.amount && (
                                <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                                  <CircleAlert size={20} />
                                  {errorsSend.amount.message &&
                                    String(errorsSend.amount.message)}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="receiver" className="text-right">
                                {t("input.fundsEmail")}
                              </Label>
                              <Input
                                id="receiver"
                                type="text"
                                placeholder={t("input.recipient")}
                                className="col-span-3"
                                {...registerSend("receiver", {
                                  required: true,
                                })}
                                onChange={() => clearErrorsSend("receiver")}
                              />
                              {errorsSend.receiver && (
                                <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                                  <CircleAlert size={20} />
                                  {errorsSend.receiver.message &&
                                    String(errorsSend.receiver.message)}
                                </span>
                              )}
                            </div>
                          </div>
                          <DialogFooter className="flex flex-row justify-end">
                            {/* < DialogClose asChild>
                              <Button type="submit" >{t("buttons.sendFunds")}</Button>
                            </DialogClose> */}

                            <Button type="submit" disabled={isSubmittingSend}>
                              {isSubmittingSend ? (
                                <Loader size={20} className="animate-spin" />
                              ) : (
                                `${t("buttons.sendFunds")}`
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {t("buttons.sendFunds")}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Dialog
                      open={requestMobileDialogOpen}
                      onOpenChange={setRequestMobileDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size={"icon"}
                          variant={"ghost"}
                          onClick={() => {
                            clearErrorsRequest("amount"),
                              clearErrorsRequest("sender");
                          }}
                        >
                          <HandCoins size={20} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-11/12 rounded-xl sm:max-w-[425px]">
                        <form
                          onSubmit={handleSubmitRequest(requestTransaction)}
                        >
                          <DialogHeader>
                            <DialogTitle>
                              {t("userPanel.requestFunds.title")}
                            </DialogTitle>
                            <DialogDescription>
                              {t("userPanel.requestFunds.description")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amount" className="text-right">
                                {t("input.fundsAmount")}
                              </Label>
                              <Input
                                id="amount"
                                type="text"
                                placeholder="$100.00"
                                autoComplete="off"
                                className="col-span-3"
                                {...registerRequest("amount", {
                                  required: true,
                                })}
                                onChange={() => clearErrorsRequest("amount")}
                              />
                              {errorsRequest.amount && (
                                <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                                  <CircleAlert size={20} />
                                  {errorsRequest.amount.message &&
                                    String(errorsRequest.amount.message)}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="sender" className="text-right">
                                {t("input.fundsEmail")}
                              </Label>
                              <Input
                                id="sender"
                                type="text"
                                placeholder={t("input.recipient")}
                                className="col-span-3"
                                {...registerRequest("sender", {
                                  required: true,
                                })}
                                onChange={() => clearErrorsRequest("sender")}
                              />
                              {errorsRequest.sender && (
                                <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                                  <CircleAlert size={20} />
                                  {errorsRequest.sender.message &&
                                    String(errorsRequest.sender.message)}
                                </span>
                              )}
                            </div>
                          </div>
                          <DialogFooter className="flex flex-row justify-end">
                            {/* <DialogClose asChild>
                              <Button type="submit" >
                                {t("requestFundsAction")}
                              </Button>
                            </DialogClose> */}
                            <Button
                              type="submit"
                              disabled={isSubmittingRequest}
                            >
                              {isSubmittingSend ? (
                                <Loader size={20} className="animate-spin" />
                              ) : (
                                `${t("buttons.sendFunds")}`
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {t("buttons.requestFunds")}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Dialog
                      open={depositMobileDialogOpen}
                      onOpenChange={setDepositMobileDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size={"icon"}
                          variant={"ghost"}
                          onClick={() => clearErrorsDeposit("amount")}
                        >
                          <DollarSign size={20} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-11/12 rounded-xl sm:max-w-[425px]">
                        <form
                          onSubmit={handleSubmitDeposit(depositTransaction)}
                        >
                          <DialogHeader>
                            <DialogTitle>
                              {t("userPanel.depositFunds.title")}
                            </DialogTitle>
                            <DialogDescription>
                              {t("userPanel.depositFunds.description")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amount" className="text-right">
                                {t("input.fundsAmount")}
                              </Label>
                              <Input
                                id="amount"
                                type="text"
                                placeholder="$100.00"
                                autoComplete="off"
                                className="col-span-3"
                                {...registerDeposit("amount", {
                                  required: true,
                                })}
                                onChange={() => clearErrorsDeposit("amount")}
                              />
                              {errorsDeposit.amount && (
                                <span className="col-span-4 flex items-center gap-1 text-xs text-destructive">
                                  <CircleAlert size={20} />
                                  {errorsDeposit.amount.message &&
                                    String(errorsDeposit.amount.message)}
                                </span>
                              )}
                            </div>
                          </div>
                          <DialogFooter className="flex flex-row justify-end">
                            {/* <DialogClose asChild>
                              <Button type="submit" >
                                {t("buttons.depositFunds")}
                              </Button>
                            </DialogClose> */}
                            <Button
                              type="submit"
                              disabled={isSubmittingDeposit}
                            >
                              {isSubmittingDeposit ? (
                                <Loader size={20} className="animate-spin" />
                              ) : (
                                `${t("buttons.depositFunds")}`
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {t("buttons.depositFunds")}
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </nav>
      </aside>
      <Toaster richColors />
    </aside>
  );
}
