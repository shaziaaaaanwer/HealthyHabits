// // import React, { useState } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   Moon,
// //   Droplets,
// //   TrendingUp,
// //   Target,
// //   Calendar,
// //   Settings,
// //   ChevronRight,
// //   Menu,
// //   X,
// // } from "lucide-react";

// // const Sidebar: React.FC = () => {
// //   const location = useLocation();
// //   const [isCollapsed, setIsCollapsed] = useState(false);

// //   const navigationItems = [
// //     {
// //       name: "Dashboard",
// //       href: "/dashboard",
// //       icon: LayoutDashboard,
// //       color: "from-purple-500 to-pink-500",
// //     },
// //     {
// //       name: "Sleep Tracker",
// //       href: "/dashboard/sleep",
// //       icon: Moon,
// //       color: "from-indigo-500 to-purple-500",
// //     },
// //     {
// //       name: "Water Intake",
// //       href: "/dashboard/water",
// //       icon: Droplets,
// //       color: "from-blue-500 to-cyan-500",
// //     },
// //     {
// //       name: "Analytics",
// //       href: "/dashboard/analytics",
// //       icon: TrendingUp,
// //       color: "from-green-500 to-emerald-500",
// //     },
// //     {
// //       name: "Goals",
// //       href: "/dashboard/goals",
// //       icon: Target,
// //       color: "from-orange-500 to-red-500",
// //     },
// //     {
// //       name: "Calendar",
// //       href: "/dashboard/calendar",
// //       icon: Calendar,
// //       color: "from-teal-500 to-blue-500",
// //     },
// //   ];

// //   const isActive = (href: string) => {
// //     if (href === "/dashboard") {
// //       return location.pathname === "/dashboard";
// //     }
// //     return location.pathname.startsWith(href);
// //   };

// //   return (
// //     <div
// //       className={`${
// //         isCollapsed ? "w-16" : "w-64"
// //       } bg-white shadow-lg border-r border-gray-200 h-full transition-all duration-300 relative`}
// //     >
// //       {/* Toggle Button */}
// //       <button
// //         onClick={() => setIsCollapsed(!isCollapsed)}
// //         className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
// //       >
// //         {isCollapsed ? (
// //           <Menu className="w-4 h-4 text-gray-600" />
// //         ) : (
// //           <X className="w-4 h-4 text-gray-600" />
// //         )}
// //       </button>

// //       <div className={`p-6 ${isCollapsed ? "px-3" : ""}`}>
// //         {!isCollapsed && (
// //           <h2 className="text-lg font-bold text-gray-900 mb-6">
// //             Health Tracking
// //           </h2>
// //         )}

// //         <nav className="space-y-2">
// //           {navigationItems.map((item) => {
// //             const active = isActive(item.href);

// //             return (
// //               <Link
// //                 key={item.name}
// //                 to={item.href}
// //                 title={isCollapsed ? item.name : undefined}
// //                 className={`
// //                   group flex items-center ${
// //                     isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3"
// //                   } rounded-xl transition-all duration-200
// //                   ${
// //                     active
// //                       ? "bg-gradient-to-r " +
// //                         item.color +
// //                         " text-white shadow-lg transform scale-105"
// //                       : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
// //                   }
// //                 `}
// //               >
// //                 <div
// //                   className={`
// //                   p-2 rounded-lg ${isCollapsed ? "" : "mr-3"} transition-all
// //                   ${
// //                     active
// //                       ? "bg-white/20"
// //                       : "bg-gray-100 group-hover:bg-gray-200"
// //                   }
// //                 `}
// //                 >
// //                   <item.icon
// //                     className={`w-5 h-5 ${
// //                       active ? "text-white" : "text-gray-600"
// //                     }`}
// //                   />
// //                 </div>

// //                 {!isCollapsed && (
// //                   <span className="font-medium flex-1">{item.name}</span>
// //                 )}

// //                 {active && !isCollapsed && (
// //                   <ChevronRight className="w-4 h-4 text-white/80" />
// //                 )}
// //               </Link>
// //             );
// //           })}
// //         </nav>
// //       </div>

// //       <div className="absolute bottom-6 left-6 right-6">
// //         <Link
// //           to="/dashboard/settings"
// //           title={isCollapsed ? "Settings" : undefined}
// //           className={`flex items-center ${
// //             isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3"
// //           } text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all`}
// //         >
// //           <div
// //             className={`p-2 rounded-lg bg-gray-100 ${
// //               isCollapsed ? "" : "mr-3"
// //             }`}
// //           >
// //             <Settings className="w-5 h-5 text-gray-600" />
// //           </div>
// //           {!isCollapsed && <span className="font-medium">Settings</span>}
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Sidebar;

// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Moon,
//   Droplets,
//   TrendingUp,
//   Target,
//   Calendar,
//   Settings,
//   ChevronRight,
//   Menu,
//   X,
// } from "lucide-react";

// const Sidebar: React.FC = () => {
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const navigationItems = [
//     {
//       name: "Dashboard",
//       href: "/dashboard",
//       icon: LayoutDashboard,
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       name: "Sleep Tracker",
//       href: "/dashboard/sleep",
//       icon: Moon,
//       color: "from-indigo-500 to-purple-500",
//     },
//     {
//       name: "Water Intake",
//       href: "/dashboard/water",
//       icon: Droplets,
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       name: "Analytics",
//       href: "/dashboard/analytics",
//       icon: TrendingUp,
//       color: "from-green-500 to-emerald-500",
//     },
//     {
//       name: "Goals",
//       href: "/dashboard/goals",
//       icon: Target,
//       color: "from-orange-500 to-red-500",
//     },
//     {
//       name: "Calendar",
//       href: "/dashboard/calendar",
//       icon: Calendar,
//       color: "from-teal-500 to-blue-500",
//     },
//   ];

//   const isActive = (href: string) =>
//     location.pathname === href || location.pathname.startsWith(href + "/");

//   return (
//     <aside
//       className={`${
//         isCollapsed ? "w-16" : "w-64"
//       } bg-white shadow-lg border-r border-gray-200 h-full transition-all duration-300 relative`}
//     >
//       {/* Toggle Button */}
//       <button
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
//         aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//       >
//         {isCollapsed ? (
//           <Menu className="w-4 h-4 text-gray-600" />
//         ) : (
//           <X className="w-4 h-4 text-gray-600" />
//         )}
//       </button>

//       <div className={`p-6 ${isCollapsed ? "px-3" : ""}`}>
//         {!isCollapsed && (
//           <h2 className="text-lg font-bold text-gray-900 mb-6">
//             Health Tracking
//           </h2>
//         )}

//         <nav className="space-y-2">
//           {navigationItems.map(({ name, href, icon: Icon, color }) => {
//             const active = isActive(href);

//             return (
//               <Link
//                 key={name}
//                 to={href}
//                 title={isCollapsed ? name : undefined}
//                 className={`group flex items-center ${
//                   isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3"
//                 } rounded-xl transition-all duration-200 ${
//                   active
//                     ? `bg-gradient-to-r ${color} text-white shadow-lg transform scale-[1.02]`
//                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                 }`}
//               >
//                 <div
//                   className={`p-2 rounded-lg transition-all ${
//                     isCollapsed ? "" : "mr-3"
//                   } ${
//                     active
//                       ? "bg-white/20"
//                       : "bg-gray-100 group-hover:bg-gray-200"
//                   }`}
//                 >
//                   <Icon
//                     className={`w-5 h-5 ${
//                       active ? "text-white" : "text-gray-600"
//                     }`}
//                   />
//                 </div>

//                 {!isCollapsed && (
//                   <span className="font-medium flex-1">{name}</span>
//                 )}

//                 {active && !isCollapsed && (
//                   <ChevronRight className="w-4 h-4 text-white/80" />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Settings Button */}
//       <div className="absolute bottom-6 left-6 right-6">
//         <Link
//           to="/dashboard/settings"
//           title={isCollapsed ? "Settings" : undefined}
//           className={`flex items-center ${
//             isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3"
//           } text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all`}
//         >
//           <div
//             className={`p-2 rounded-lg bg-gray-100 ${
//               isCollapsed ? "" : "mr-3"
//             }`}
//           >
//             <Settings className="w-5 h-5 text-gray-600" />
//           </div>
//           {!isCollapsed && <span className="font-medium">Settings</span>}
//         </Link>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
