import { Label } from "../components/label";
import { SvgColor } from "../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`src/assets/icons/navbar/${name}.svg`} />
);

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: "Thống kê",
    path: "/admin/dashboard",
    icon: icon("ic-analytics"),
  },
  {
    title: "Phân tích cảm xúc",
    path: "/admin/sentiments",
    icon: icon("ic-analytics"),
  },
  {
    title: "Người dùng",
    path: "/admin/users",
    icon: icon("ic-user"),
  },
  {
    title: "Phim",
    path: "/admin/movies",
    icon: icon("ic-cart"),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: "Lịch chiếu",
    path: "/admin/showtime",
    icon: icon("ic-blog"),
  },
  {
    title: "Room",
    path: "/admin/room",
    icon: icon("ic-cart"),
  },
  {
    title: "Booking",
    path: "/admin/booking",
    icon: icon("ic-analytics"),
  },
  {
    title: "Promotions",
    path: "/admin/promotions",
    icon: icon("ic-cart"),
  },

];
