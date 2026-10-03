import type { StructureResolver } from "sanity/structure";
import { BoltIcon } from "@sanity/icons/Bolt";
import{CalendarIcon} from "@sanity/icons/Calendar";
import {HomeIcon} from "@sanity/icons/Home";
import {TagIcon} from "@sanity/icons/Tag";
import {ClipboardIcon} from "@sanity/icons/Clipboard";
import {UserIcon} from "@sanity/icons/User";
import {
  UsersIcon,
} from "@sanity/icons/Users";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Fitcard Studio")
    .items([
      S.listItem()
        .title("Classes")
        .icon(BoltIcon)
        .child(
          S.list()
            .title("Classes")
            .items([
              S.listItem()
                .title("Activities")
                .icon(BoltIcon)
                .child(S.documentTypeList("activity")),

              S.listItem()
                .title("Sessions")
                .icon(CalendarIcon)
                .child(S.documentTypeList("classSession")),

              S.listItem()
                .title("Categories")
                .icon(TagIcon)
                .child(S.documentTypeList("category")),
            ])
        ),

      S.divider(),

      S.listItem()
        .title("Venues")
        .icon(HomeIcon)
        .child(S.documentTypeList("venue")),

      S.divider(),

      S.listItem()
        .title("Users & Bookings")
        .icon(UsersIcon)
        .child(
          S.list()
            .title("Users & Bookings")
            .items([
              S.listItem()
                .title("Users")
                .icon(UserIcon)
                .child(S.documentTypeList("userProfile")),

              S.listItem()
                .title("Bookings")
                .icon(ClipboardIcon)
                .child(S.documentTypeList("booking")),
            ])
        ),
    ]);