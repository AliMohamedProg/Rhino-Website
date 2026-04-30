import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function AccessDenied() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <div className="flex flex-col items-center gap-6 text-center max-w-md">
                <div className="rounded-full bg-destructive/10 p-4">
                    <ShieldAlert className="h-16 w-16 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter">Access Denied</h1>
                    <p className="text-lg text-muted-foreground">
                        You don't have permission to access this page. Please contact your administrator if you think this is a mistake.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Go to Home
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}
