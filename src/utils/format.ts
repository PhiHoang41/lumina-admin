import dayjs from "dayjs";

export const formatPrice = (price: number): string => {
  return price.toLocaleString("vi-VN");
};

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};
