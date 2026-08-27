import { useMemo, useState } from "react";
import { Avatar, Badge, IconButton } from "@radix-ui/themes";
import { Lottie } from "lottie-react";
import {
  BellIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleBackslashIcon,
  CircleIcon,
  ClockIcon,
  CounterClockwiseClockIcon,
  DotsHorizontalIcon,
  ExclamationTriangleIcon,
  ExternalLinkIcon,
  GearIcon,
  HamburgerMenuIcon,
  LinkBreak2Icon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  PlusIcon,
  ReaderIcon,
  StarIcon,
  TargetIcon,
  TokensIcon,
} from "@radix-ui/react-icons";
import { doneAnimation, inProgressAnimation } from "../data/agent-state-animations";

function createAgentIssue(issue) {
  return {
    ...issue,
    status: "todo",
    assignee: { kind: "agent", label: "AI Agent" },
    propertySummary: {
      ...issue.propertySummary,
      status: "Queued",
      priority: issue.propertySummary?.priority ?? "Medium",
    },
    agent: {
      summary: "Queued behind the active AI investigation.",
      agentStatus: { label: "Queued", tone: "queued" },
      lastUpdatedAt: "just now",
      milestones: [
        {
          title: "Create plan",
          description: "Turn the ticket into a step-by-step plan before debugging starts.",
          status: "pending",
          statusLabel: "Pending",
        },
        {
          title: "Reproduce the issue",
          description: "Confirm the bug and capture what the user sees.",
          status: "pending",
          statusLabel: "Pending",
        },
        {
          title: "Investigate cause",
          description: "Trace the failure path and narrow the likely cause.",
          status: "pending",
          statusLabel: "Pending",
        },
        {
          title: "Validate answer",
          description: "Pressure-test the explanation before sharing it.",
          status: "pending",
          statusLabel: "Pending",
        },
        {
          title: "Prepare handoff",
          description: "Package the output so a human can review it quickly.",
          status: "pending",
          statusLabel: "Pending",
        },
      ],
      humanActionRequired: {
        title: "No action needed",
        description: "This ticket will start automatically after the current AI task finishes.",
        badge: "Queued",
        tone: "queued",
      },
      actions: [
        { label: "Change priority", kind: "secondary" },
        { label: "Reassign to human", kind: "secondary" },
      ],
    },
    activity: [
      { time: "Now", copy: "Assigned to AI Agent." },
      { time: "Now", copy: "Waiting for the current investigation slot." },
      ...(issue.activity ?? []),
    ],
  };
}

function deriveGroups(issues, selectedTab) {
  const agentIssues = issues.filter((issue) => issue.assignee.kind === "agent");
  const humanIssues = issues.filter((issue) => issue.assignee.kind !== "agent");

  const activeGroups = [
    {
      id: "in-progress",
      title: "In Progress",
      count: humanIssues.filter((issue) => issue.status === "progress").length,
      statusIcon: "progress",
      issues: humanIssues.filter((issue) => issue.status === "progress"),
    },
    {
      id: "todo",
      title: "Todo",
      count: humanIssues.filter((issue) => issue.status === "todo" && issue.date !== "Aug 25" && issue.date !== "Aug 24").length,
      statusIcon: "todo",
      issues: humanIssues.filter((issue) => issue.status === "todo" && issue.date !== "Aug 25" && issue.date !== "Aug 24"),
    },
  ];

  const backlogGroups = [
    {
      id: "backlog",
      title: "Backlog",
      count: humanIssues.filter((issue) => issue.date === "Aug 25" || issue.date === "Aug 24").length,
      statusIcon: "todo",
      issues: humanIssues.filter((issue) => issue.date === "Aug 25" || issue.date === "Aug 24"),
    },
  ];

  const aiAgentGroups = [
    {
      id: "working-now",
      title: "Working now",
      count: agentIssues.filter((issue) => issue.agent?.agentStatus.label === "Investigating").length,
      statusIcon: "progress",
      issues: agentIssues.filter((issue) => issue.agent?.agentStatus.label === "Investigating"),
    },
    {
      id: "queued",
      title: "Queued",
      count: agentIssues.filter((issue) => issue.agent?.agentStatus.label === "Queued").length,
      statusIcon: "todo",
      issues: agentIssues.filter((issue) => issue.agent?.agentStatus.label === "Queued"),
    },
    {
      id: "needs-review",
      title: "Needs review",
      count: agentIssues.filter((issue) => issue.agent?.agentStatus.label === "Needs review").length,
      statusIcon: "done",
      issues: agentIssues.filter((issue) => issue.agent?.agentStatus.label === "Needs review"),
    },
  ];

  return {
    active: activeGroups,
    backlog: backlogGroups,
    all: [...aiAgentGroups, ...activeGroups, ...backlogGroups],
    "ai-agent": aiAgentGroups,
  }[selectedTab];
}

function NavRow({ icon: Icon, label, active = false, nested = false, expandable = false }) {
  return (
    <button className={`sidebar-row ${active ? "is-active" : ""} ${nested ? "is-nested" : ""}`} type="button">
      <span className="sidebar-row-icon">
        <Icon />
      </span>
      <span className="sidebar-row-label">{label}</span>
      {expandable ? <ChevronDownIcon className="sidebar-row-caret" /> : null}
    </button>
  );
}

function PriorityIcon({ kind }) {
  if (kind === "alert") return <ExclamationTriangleIcon className="issue-leading-icon issue-leading-icon-alert" />;
  return <ReaderIcon className="issue-leading-icon issue-leading-icon-bars" />;
}

function StatusIcon({ kind }) {
  if (kind === "progress") return <ClockIcon className="status-icon status-icon-progress" />;
  if (kind === "done") return <CircleBackslashIcon className="status-icon status-icon-done" />;
  return <CircleIcon className="status-icon status-icon-todo" />;
}

function Sidebar({ template }) {
  const { brand, primaryNavigation, workspace, teamNavigation, tryLinks, tryLabel } = template;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Avatar fallback={brand.initials} size="2" radius="full" className="brand-avatar" />
          <span>{brand.name}</span>
          <ChevronDownIcon />
        </div>

        <div className="sidebar-header-actions">
          <IconButton variant="ghost" size="2" className="sidebar-icon-button" aria-label="Search">
            <MagnifyingGlassIcon />
          </IconButton>
          <IconButton variant="ghost" size="2" className="sidebar-icon-button" aria-label="Open">
            <ExternalLinkIcon />
          </IconButton>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {primaryNavigation.map((item) => (
          <NavRow key={item.label} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          <span>{workspace.label}</span>
          <ChevronDownIcon />
        </div>
        {workspace.links.map((item) => (
          <NavRow key={item.label} icon={item.icon} label={item.label} />
        ))}
      </section>

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          <span>{teamNavigation.label}</span>
          <ChevronDownIcon />
        </div>
        <NavRow icon={teamNavigation.icon} label={teamNavigation.team.label} expandable />
        <div className="sidebar-subnav">
          {teamNavigation.team.links.map((item) => (
            <NavRow key={item.label} icon={item.icon} label={item.label} active={Boolean(item.active)} nested />
          ))}
        </div>
      </section>

      <section className="sidebar-section sidebar-section-try">
        <div className="sidebar-section-title">
          <span>{tryLabel}</span>
          <ChevronDownIcon />
        </div>
        {tryLinks.map((item) => (
          <NavRow key={item.label} icon={item.icon} label={item.label} />
        ))}
      </section>

      <button className="help-button" type="button" aria-label="Help">
        ?
      </button>
    </aside>
  );
}

function WorkspaceHeader({ template, selectedTab, onTabSelect, selectedIssue }) {
  const { header, tabs, toolbarActions } = template;

  if (selectedIssue) {
    return (
      <header className="workspace-header is-detail">
        <div className="workspace-title-row">
          <div className="workspace-title">
            <header.icon className="workspace-title-icon" />
            <span>{header.teamLabel}</span>
            <ChevronRightIcon className="breadcrumb-separator" />
            <span>Issues</span>
            <ChevronRightIcon className="breadcrumb-separator" />
            <span className="issue-breadcrumb">{`${selectedIssue.id} ${selectedIssue.title}`}</span>
            <StarIcon className="workspace-star" />
          </div>
          <div className="detail-header-tools">
            <span className="detail-header-count">3 / 10</span>
            <IconButton variant="ghost" size="2" className="workspace-icon-button" aria-label="Copy link">
              <ExternalLinkIcon />
            </IconButton>
            <IconButton variant="ghost" size="2" className="workspace-icon-button" aria-label="Open activity">
              <ReaderIcon />
            </IconButton>
            <IconButton variant="ghost" size="2" className="workspace-icon-button" aria-label="Controls">
              <MixerHorizontalIcon />
            </IconButton>
            <IconButton variant="ghost" size="2" className="workspace-icon-button" aria-label="Send to agent">
              <PlusIcon />
            </IconButton>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="workspace-header">
      <div className="workspace-title-row">
        <div className="workspace-title">
          <header.icon className="workspace-title-icon" />
          <span>{header.teamLabel}</span>
          <ChevronRightIcon className="breadcrumb-separator" />
          <span>{header.currentLabel}</span>
          <StarIcon className="workspace-star" />
        </div>
        <BellIcon className="workspace-bell" />
      </div>

      <div className="workspace-toolbar">
        <div className="segment-tabs" role="tablist" aria-label="Issue views">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selectedTab === tab.value}
              className={`segment-tab ${selectedTab === tab.value ? "is-selected" : ""}`}
              onClick={() => onTabSelect(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="toolbar-controls">
          {toolbarActions.map((action) => (
            <IconButton
              key={action.label}
              variant="ghost"
              size="2"
              className="workspace-icon-button"
              aria-label={action.label}
            >
              <action.icon />
            </IconButton>
          ))}
        </div>
      </div>
    </header>
  );
}

function IssueRow({ issue, onSelect }) {
  return (
    <article className="issue-row">
      <button type="button" className="issue-row-button" onClick={() => onSelect(issue.id)}>
        <div className="issue-primary">
          <PriorityIcon kind={issue.priority} />
          <span className="issue-id">{issue.id}</span>
          <StatusIcon kind={issue.status} />
          <h2 className="issue-title">{issue.title}</h2>
        </div>

        <div className="issue-meta">
          <Badge radius="full" variant="surface" className={`meta-badge meta-badge-${issue.type.tone}`}>
            <span className="meta-badge-dot" />
            {issue.type.label}
          </Badge>
          <Badge radius="full" variant="outline" className="project-badge">
            <TokensIcon />
            {issue.project}
          </Badge>
          <span className={`issue-assignee ${issue.assignee.kind === "agent" ? "is-agent" : ""}`}>{issue.assignee.label}</span>
          <time className="issue-date">{issue.date}</time>
        </div>
      </button>
    </article>
  );
}

function IssueGroup({ group, collapsed, onToggle, onSelect }) {
  const isCollapsed = collapsed[group.id] ?? false;

  return (
    <section className="issue-group">
      <button type="button" className="group-header" onClick={() => onToggle(group.id, isCollapsed)}>
        <div className="group-header-left">
          <ChevronDownIcon className={`group-chevron ${isCollapsed ? "is-collapsed" : ""}`} />
          <StatusIcon kind={group.statusIcon} />
          <span className="group-title">{group.title}</span>
          <span className="group-count">{group.count}</span>
        </div>
        <PlusIcon className="group-plus" />
      </button>

      {!isCollapsed ? (
        <div className="issue-list">
          {group.issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} onSelect={onSelect} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function IssueDescription({ issue }) {
  if (issue.expectedBehavior && issue.actualBehavior) {
    return (
      <div className="issue-description">
        <h1 className="detail-title-xl">{issue.title}</h1>
        <div className="description-block">
          <h2>Expected behavior</h2>
          <p>{issue.expectedBehavior}</p>
        </div>
        <div className="description-block">
          <h2>Actual behavior</h2>
          <p>{issue.actualBehavior}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-description">
      <h1 className="detail-title-xl">{issue.title}</h1>
      <div className="description-block">
        <h2>Context</h2>
        <p>{issue.summary}</p>
      </div>
    </div>
  );
}

function HumanNextSteps({ agent }) {
  return (
    <section className="detail-sidebar-section detail-sidebar-section-card">
      <div className="next-steps-card">
        <h4>{agent.humanActionRequired.title}</h4>
        <p>{agent.humanActionRequired.description}</p>
        <div className="next-steps-actions">
          {agent.actions.map((action) => (
            <button key={action.label} type="button" className={`next-step-button ${action.kind === "primary" ? "is-primary" : ""}`}>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertiesSidebar({ issue }) {
  const isAgentWorkingNow = issue.assignee.kind === "agent" && issue.agent?.milestones?.some((item) => item.status === "in-progress");
  const propertyRows = [
    {
      label: "Status",
      value: isAgentWorkingNow ? "Working now" : issue.propertySummary.status,
      tone: issue.assignee.kind === "agent" ? "agent-status" : "neutral",
      marker: issue.assignee.kind === "agent" ? null : (
        <span className="property-token-dot is-neutral" />
      ),
    },
    {
      label: "Priority",
      value: issue.propertySummary.priority,
      tone: issue.propertySummary.priority?.toLowerCase() === "urgent" ? "priority-urgent" : "priority-default",
      marker: <ExclamationTriangleIcon className="property-token-icon is-priority" />,
    },
    {
      label: "Assign",
      value: issue.assignee.label,
      tone: issue.assignee.kind === "agent" ? "assignee-agent" : "assignee-human",
      marker:
        issue.assignee.kind === "agent" ? (
          null
        ) : (
          <Avatar fallback={issue.assignee.label.slice(0, 1)} size="1" radius="full" className="property-avatar" />
        ),
    },
  ];

  return (
    <section className="detail-sidebar-section">
      <div className="detail-sidebar-title-row">
        <h3>Properties</h3>
      </div>
      <div className="property-list">
        {propertyRows.map((item) => (
          <div key={item.label} className="property-row">
            <span className="property-key">{item.label}</span>
            <span className={`property-token is-${item.tone}`}>
              {item.marker ? <span className="property-token-marker">{item.marker}</span> : null}
              <span className="property-value">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LabelsSidebar({ issue }) {
  if (!issue.labels?.length) return null;

  return (
    <section className="detail-sidebar-section">
      <div className="detail-sidebar-title-row">
        <h3>Labels</h3>
      </div>
      <div className="sidebar-chip-list">
        {issue.labels.map((label) => (
          <Badge key={label} radius="full" variant="surface" className={`meta-badge meta-badge-${issue.type.tone}`}>
            <span className="meta-badge-dot" />
            {label}
          </Badge>
        ))}
      </div>
    </section>
  );
}

function ProjectSidebar({ issue }) {
  if (!issue.projectDetail) return null;

  return (
    <section className="detail-sidebar-section">
      <div className="detail-sidebar-title-row">
        <h3>Project</h3>
      </div>
      <div className="tree-list">
        <div className="tree-row">
          <TokensIcon className="tree-icon is-project" />
          <span>{issue.projectDetail.name}</span>
        </div>
        {issue.projectDetail.group ? (
          <div className="tree-row is-child">
            <TargetIcon className="tree-icon is-child" />
            <span>{issue.projectDetail.group}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function BlockedBySidebar({ issue }) {
  if (!issue.blockedBy?.length) return null;

  return (
    <section className="detail-sidebar-section">
      <div className="detail-sidebar-title-row">
        <h3>Blocked by</h3>
      </div>
      <div className="tree-list">
        {issue.blockedBy.map((item, index) => (
          <div key={item} className={`tree-row ${index > 0 ? "is-stack" : ""}`}>
            <LinkBreak2Icon className="tree-icon is-blocked" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildAgentActivity(agent) {
  return agent.milestones
    .filter((item) => item.status !== "pending")
    .map((item, index) => ({
      id: `${item.title}-${index}`,
      time: item.status === "done" ? "done" : "live",
      title: item.title,
      detail: item.note ?? item.description,
      status: item.status,
      statusLabel: item.statusLabel,
    }))
    .reverse();
}

function StateAnimation({ status, size = 22 }) {
  if (status === "pending") {
    return <span className="activity-state-fallback is-pending" aria-hidden="true" />;
  }

  const animationData = status === "done" ? doneAnimation : inProgressAnimation;

  return (
    <span className={`activity-state-animation is-${status}`} aria-hidden="true">
      <Lottie animationData={animationData} loop={status === "in-progress"} autoplay style={{ width: size, height: size }} />
    </span>
  );
}

function ActivityItem({ entry }) {
  return (
    <div className={`activity-entry is-${entry.status}`}>
      <div className="activity-rail">
        <span className={`activity-marker is-${entry.status}`}>
          <StateAnimation status={entry.status} />
        </span>
      </div>
      <div className="activity-content">
        <div className="activity-entry-header">
          <span className="activity-entry-title">{entry.title ?? entry.copy}</span>
          {entry.statusLabel && entry.status !== "done" ? (
            <Badge radius="full" variant="soft" className={`timeline-badge timeline-${entry.status}`}>
              {entry.statusLabel}
            </Badge>
          ) : null}
        </div>
        {entry.detail ? <p>{entry.detail}</p> : null}
        <span className="activity-time">{entry.time}</span>
      </div>
    </div>
  );
}

function ActivitySection({ issue }) {
  const items = issue.agent ? buildAgentActivity(issue.agent) : issue.activity.map((entry) => ({ ...entry, status: "done" }));

  return (
    <section className="activity-section">
      <div className="activity-header">
        <h2>Activity</h2>
        <div className="activity-header-right">
          <span>Unsubscribe</span>
          <Avatar fallback="R" size="1" radius="full" className="mini-avatar" />
        </div>
      </div>

      <div className="activity-feed">
        {items.map((entry) => (
          <ActivityItem key={entry.id ?? `${entry.time}-${entry.copy}`} entry={entry} />
        ))}
      </div>

      <div className="comment-box">
        <span>Leave a comment...</span>
      </div>
    </section>
  );
}

function StandardDetail({ issue, onAssignToAgent }) {
  return (
    <div className="detail-layout">
      <div className="detail-main">
        <IssueDescription issue={issue} />
        <ActivitySection issue={issue} />
      </div>

      <aside className="detail-sidebar">
        <PropertiesSidebar issue={issue} />
        <LabelsSidebar issue={issue} />
        <ProjectSidebar issue={issue} />
        <BlockedBySidebar issue={issue} />
        <section className="detail-sidebar-section">
          <div className="detail-sidebar-title-row">
            <h3>Automation</h3>
          </div>
          <div className="next-steps-card">
            <p>Assign this ticket to AI Agent to generate a plan, investigate the issue, and hand back a reviewable result.</p>
            <div className="next-steps-actions">
              <button type="button" className="next-step-button is-primary" onClick={() => onAssignToAgent(issue.id)}>
                Assign to AI Agent
              </button>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}

function AgentDetail({ issue }) {
  return (
    <div className="detail-layout">
      <div className="detail-main">
        <IssueDescription issue={issue} />
        <ActivitySection issue={issue} />
      </div>

      <aside className="detail-sidebar">
        <PropertiesSidebar issue={issue} />
        <LabelsSidebar issue={issue} />
        <HumanNextSteps agent={issue.agent} />
        <ProjectSidebar issue={issue} />
        <BlockedBySidebar issue={issue} />
      </aside>
    </div>
  );
}

function IssueDetail({ issue, onBack, onAssignToAgent }) {
  return (
    <section className="issue-detail-view">
      <div className="detail-back-row">
        <button type="button" className="detail-back-button" onClick={onBack}>
          <ChevronLeftIcon />
          Back to issues
        </button>
      </div>

      {issue.agent ? <AgentDetail issue={issue} /> : <StandardDetail issue={issue} onAssignToAgent={onAssignToAgent} />}
    </section>
  );
}

function WorkspaceFooter({ template }) {
  return (
    <footer className="workspace-footer">
      <div className="workspace-footer-spacer" />
      <div className="workspace-footer-right">
        <button className="agent-chip" type="button">
          {template.footer.label}
        </button>
        <IconButton variant="ghost" size="2" className="footer-icon-button" aria-label={template.footer.actionLabel}>
          <CounterClockwiseClockIcon />
        </IconButton>
      </div>
    </footer>
  );
}

export function LinearDashboardTemplate({ template }) {
  const [selectedTab, setSelectedTab] = useState(template.defaultTab);
  const [selectedIssueId, setSelectedIssueId] = useState(template.defaultSelectedIssueId);
  const [collapsed, setCollapsed] = useState({});
  const [issues, setIssues] = useState(template.issues);

  const issuesById = useMemo(() => Object.fromEntries(issues.map((issue) => [issue.id, issue])), [issues]);
  const selectedIssue = selectedIssueId ? issuesById[selectedIssueId] : null;
  const visibleGroups = deriveGroups(issues, selectedTab) ?? [];

  function handleAssignToAgent(issueId) {
    setIssues((current) => current.map((issue) => (issue.id === issueId && issue.assignee.kind !== "agent" ? createAgentIssue(issue) : issue)));
    setSelectedIssueId(issueId);
  }

  return (
    <main className="linear-shell">
      <div className="app-body">
        <Sidebar template={template} />

        <section className="workspace">
          <div className="workspace-frame">
            <WorkspaceHeader
              template={template}
              selectedTab={selectedTab}
              onTabSelect={(nextTab) => {
                setSelectedTab(nextTab);
                setSelectedIssueId(null);
              }}
              selectedIssue={selectedIssue}
            />

            <div className="workspace-content is-single">
              {selectedIssue ? (
                <IssueDetail issue={selectedIssue} onBack={() => setSelectedIssueId(null)} onAssignToAgent={handleAssignToAgent} />
              ) : (
                <div className="issues-board">
                  {visibleGroups.map((group) => (
                    <IssueGroup
                      key={group.id}
                      group={group}
                      collapsed={collapsed}
                      onSelect={setSelectedIssueId}
                      onToggle={(groupId, isCollapsed) =>
                        setCollapsed((current) => ({
                          ...current,
                          [groupId]: !isCollapsed,
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            <WorkspaceFooter template={template} />
          </div>
        </section>
      </div>
    </main>
  );
}
