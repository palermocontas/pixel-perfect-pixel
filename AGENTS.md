<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Editable site content lives as one JSON row in `site_settings` (id=1), merged over defaults in `src/lib/site-content.ts`; only non-default values are stored so bundled placeholder images keep working.
- Site images live in a private storage bucket with long-lived signed URLs, because the workspace blocks public buckets.
- The first account to sign up becomes admin (DB trigger); admin rights are checked via `user_roles` + `has_role`.
