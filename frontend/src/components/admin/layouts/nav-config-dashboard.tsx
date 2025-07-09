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
    title: "Quản lý người dùng",
    path: "/admin/users",
    icon: icon("ic-user"),
  },
  {
    title: "Quản lý phim",
    path: "/admin/movies",
    icon: icon("ic-cart"),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: "Quản lý lịch chiếu",
    path: "/admin/showtime",
    icon: icon("ic-blog"),
  },
  {
    title: "Quản lý phòng",
    path: "/admin/room",
    icon: icon("ic-cart"),
  },
  {
    title: "Quản lý vé",
    path: "/admin/booking",
    icon: icon("ic-analytics"),
  },
  {
    title: "Quản lý khuyến mãi",
    path: "/admin/promotions",
    icon: icon("ic-cart"),
  },

];
