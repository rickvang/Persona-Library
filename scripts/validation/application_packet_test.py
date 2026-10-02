"""Exercise factual boundaries and actual local exports with fictional candidate data."""
import copy
import importlib.util
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("application_packet", Path(__file__).parents[1] / "application-packet.py")
packet = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packet)


def fixture():
    profile = {"candidate_id": "fictional", "version": "1", "identity": {"name": "Alex Example", "location": "Example City",
        "email": "alex@example.com", "links": [{"label": "Portfolio", "url": "https://example.com/portfolio"}]},
        "sources": [{"id": "career", "reference": "Fictional career fixture", "revision": "1"}],
        "facts": {"current": {"text": "Designed workflow improvements across 4 products.", "source": "career", "role": "current"},
                  "earlier": {"text": "Reduced task time from 3 hours to 20 minutes.", "source": "career", "role": "earlier"}},
        "roles": [{"id": "current", "employer": "Example Current", "title": "Product Designer", "start": "2023-01", "end": "2025-12"},
                  {"id": "earlier", "employer": "Example Earlier", "title": "Designer", "start": "2020-01", "end": "2022-12"}],
        "skills": ["Figma", "User research"], "education": ["Example University | BA Design"]}
    draft = {"candidate_id": "fictional", "profile_version": "1", "job": {"id": "job-1", "company": "Example Employer",
        "role": "Product Designer", "source_url": "https://example.com/jobs/1", "checked_on": "2026-10-02",
        "requirements": [{"id": "workflow", "text": "Improve product workflows"}]},
        "resume": {"headline": "Product Designer", "summary": {"text": "Designed workflow improvements across four products.", "evidence": ["current"]},
                   "roles": [{"id": "current", "bullets": [{"text": "Designed workflow improvements across 4 products.", "evidence": ["current"]}]}],
                   "omitted_roles": [{"id": "earlier", "reason": "Earlier experience omitted for this short example"}], "skills": ["Figma"]},
        "cover_letter": {"date": "2026-10-02", "opening": "Your focus on clear product workflows interests me.",
                         "paragraphs": [{"text": "I designed workflow improvements across 4 products.", "evidence": ["current"]}],
                         "closing": "I would welcome a conversation about your team."},
        "matches": [{"requirement": "workflow", "evidence": ["current"]}], "unanswered": ["Work authorization"]}
    return profile, draft


class PacketTest(unittest.TestCase):
    def test_real_exports_and_unknown_answers(self):
        profile, draft = fixture()
        with tempfile.TemporaryDirectory() as root:
            report = packet.build(profile, draft, Path(root) / "packet")
            self.assertEqual(len(report["files"]), 4)
            self.assertEqual(report["unanswered"], ["Work authorization"])
            self.assertEqual(report["stage"], "review_required")
            self.assertTrue(all(f["text"] == "pass" and f["links"] == "pass" for f in report["files"].values()))
            self.assertEqual(report["files"]["resume.pdf"]["pages"], 1)
            self.assertTrue((Path(root) / "packet/preview/cover-letter-1.png").is_file())

    def test_wrong_candidate_or_stale_profile(self):
        for field, value in (("candidate_id", "another"), ("profile_version", "old")):
            profile, draft = fixture()
            draft[field] = value
            with self.assertRaises(ValueError):
                packet.prepare(profile, draft)

    def test_new_numeric_claim(self):
        profile, draft = fixture()
        draft["resume"]["summary"]["text"] = "Led 9 products."
        with self.assertRaisesRegex(ValueError, "unsupported number"):
            packet.prepare(profile, draft)

    def test_wrong_employer_attribution(self):
        profile, draft = fixture()
        draft["resume"]["roles"][0]["bullets"][0]["evidence"] = ["earlier"]
        with self.assertRaisesRegex(ValueError, "wrong role"):
            packet.prepare(profile, draft)

    def test_source_identity_cannot_be_rewritten_in_draft(self):
        profile, draft = fixture()
        draft["resume"]["roles"][0]["employer"] = "Fabricated Employer"
        with self.assertRaisesRegex(ValueError, "source career facts|source|profile"):
            packet.prepare(profile, draft)

    def test_omission_must_be_explicit(self):
        profile, draft = fixture()
        draft["resume"]["omitted_roles"] = []
        with self.assertRaisesRegex(ValueError, "omitted"):
            packet.prepare(profile, draft)

    def test_required_letter_and_requirements(self):
        profile, draft = fixture()
        draft["job"]["cover_letter_required"] = True
        del draft["cover_letter"]
        with self.assertRaisesRegex(ValueError, "requires a cover letter"):
            packet.prepare(profile, draft)
        profile, draft = fixture()
        draft["matches"] = []
        with self.assertRaisesRegex(ValueError, "requirement"):
            packet.prepare(profile, draft)

    def test_chronology_and_career_periods(self):
        profile, draft = fixture()
        draft["resume"]["roles"].insert(0, {"id": "earlier", "bullets": []})
        draft["resume"]["omitted_roles"] = []
        result = packet.prepare(profile, draft)
        self.assertEqual([r["id"] for r in result["roles"]], ["current", "earlier"])
        profile["roles"][0]["start"] = "2026-01"
        with self.assertRaisesRegex(ValueError, "ends before"):
            packet.prepare(profile, draft)

    def test_existing_files_preserved(self):
        profile, draft = fixture()
        with tempfile.TemporaryDirectory() as root:
            path = Path(root) / "resume.pdf"
            path.write_bytes(b"existing work")
            with self.assertRaisesRegex(ValueError, "preserved"):
                packet.build(profile, draft, root)
            self.assertEqual(path.read_bytes(), b"existing work")

    def test_page_overflow_is_not_silently_shrunk(self):
        profile, draft = fixture()
        draft["cover_letter"]["paragraphs"] = [copy.deepcopy(draft["cover_letter"]["paragraphs"][0]) for _ in range(70)]
        with tempfile.TemporaryDirectory() as root:
            with self.assertRaisesRegex(ValueError, "page budget"):
                packet.build(profile, draft, Path(root) / "packet")


if __name__ == "__main__":
    unittest.main()
