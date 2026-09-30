### Supabase Credential in the project 
- clients.ts: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY
- .mcp.json: PROJECT_REF, SUPABASE_ACCESS_TOKEN
- config.toml; PROJECT_ID

### Supabase Setup
- Google Auth Provider enable.
 - Go to Authentication > Sign in / Providers > 

### Local development
#### Re-apply existing migrations 
supabase logout
supabase login
supabase db reset
supabase start 
> http://localhost:54323
> This is the local supabase server for your to invoke API against

#### Add new migrations 
supabase migration new xxxxx_table
> update the sql in the xxxxx_table
supabase db reset

#### Deploy to remote project 
supabase logout
supabase login
SUPABASE_PROJECT_REF=XXXXX
supabase link --debug --project-ref $SUPABASE_PROJECT_REF
supabase db push
